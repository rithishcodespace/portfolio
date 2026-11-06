const createError = require("http-errors");
const db = require("../config/connection");
const { sendResumeToVisitor, sendNotificationToOwner } = require("../utils/email");
const { verifyToken, ADMIN_COOKIE_NAME } = require("../middleware/auth");

// In-memory rate limiting map: ip -> array of timestamps
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

/**
 * Clean up old rate limit entries every 15 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}, 15 * 60 * 1000);

/**
 * Validate email format
 */
function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format for LinkedIn profile
 */
function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  let trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }
  try {
    const parsed = new URL(trimmed);
    return Boolean(parsed.hostname && parsed.hostname.includes("."));
  } catch (e) {
    return false;
  }
}

/**
 * POST /api/resume/request
 */
exports.postResumeRequest = async (req, res, next) => {
  try {
    // 1. IP Rate Limiting Check
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const ipKey = Array.isArray(clientIp) ? clientIp[0] : clientIp.split(",")[0].trim();
    
    const now = Date.now();
    const timestamps = rateLimitMap.get(ipKey) || [];
    const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return next(createError(429, "Too many resume requests from your IP address. Please try again in an hour."));
    }

    // 2. Input extraction & sanitization
    let { fullName, email, company, role, reason, linkedin } = req.body || {};

    fullName = fullName ? String(fullName).trim() : "";
    email = email ? String(email).trim().toLowerCase() : "";
    company = company ? String(company).trim() : "";
    role = role ? String(role).trim() : "";
    reason = reason ? String(reason).trim() : "";
    linkedin = linkedin ? String(linkedin).trim() : "";

    // 3. Validation
    if (!fullName) {
      return next(createError(400, "Full Name is required."));
    }
    if (fullName.length > 150) {
      return next(createError(400, "Full Name must not exceed 150 characters."));
    }

    if (!email) {
      return next(createError(400, "Work Email is required."));
    }
    if (!isValidEmail(email)) {
      return next(createError(400, "Please provide a valid email address."));
    }
    if (email.length > 255) {
      return next(createError(400, "Email must not exceed 255 characters."));
    }

    if (!company) {
      return next(createError(400, "Company / Organization is required."));
    }
    if (company.length > 255) {
      return next(createError(400, "Company / Organization must not exceed 255 characters."));
    }

    if (role && role.length > 150) {
      return next(createError(400, "Role / Position must not exceed 150 characters."));
    }

    if (reason && reason.length > 2000) {
      return next(createError(400, "Reason must not exceed 2000 characters."));
    }

    if (linkedin) {
      if (!linkedin.startsWith("http://") && !linkedin.startsWith("https://")) {
        linkedin = `https://${linkedin}`;
      }
      if (!isValidUrl(linkedin)) {
        return next(createError(400, "Please provide a valid LinkedIn profile URL."));
      }
      if (linkedin.length > 255) {
        return next(createError(400, "LinkedIn URL must not exceed 255 characters."));
      }
    }

    // 4. Save to PostgreSQL
    const sql = `
      INSERT INTO resume_requests (full_name, email, company, role, reason, linkedin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [fullName, email, company, role || null, reason || null, linkedin || null];

    const dbResult = await db.query(sql, values);
    const savedRecord = dbResult.rows[0];

    // Record rate limit timestamp
    validTimestamps.push(now);
    rateLimitMap.set(ipKey, validTimestamps);

    // 5. Send Emails (visitor resume + owner notification)
    sendResumeToVisitor({ email, fullName }).catch((err) => {
      console.error("[Resume Request] Non-fatal background error sending resume:", err);
    });

    sendNotificationToOwner({ fullName, email, company, role, reason, linkedin }).catch((err) => {
      console.error("[Resume Request] Non-fatal background error sending notification:", err);
    });

    // 6. Return Success Response
    return res.status(200).json({
      success: true,
      message: "Resume sent successfully! Check your email inbox.",
      data: savedRecord
    });
  } catch (error) {
    console.error("Resume request controller error:", error);
    next(error);
  }
};

/**
 * GET /api/resume/requests (Admin only)
 */
exports.getResumeRequests = async (req, res, next) => {
  try {
    // Authenticate admin session
    let token = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : null;
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== "admin") {
      return next(createError(401, "Not authorized to access resume requests"));
    }

    const { filter } = req.query;
    let sql = "SELECT * FROM resume_requests ORDER BY created_at DESC";

    if (filter === 'unseen' || filter === 'unvisited') {
      sql = "SELECT * FROM resume_requests WHERE seen = false OR seen IS NULL ORDER BY created_at DESC";
    } else if (filter === 'seen' || filter === 'visited') {
      sql = "SELECT * FROM resume_requests WHERE seen = true ORDER BY created_at DESC";
    }

    const dbResult = await db.query(sql);

    return res.status(200).json({
      success: true,
      requests: dbResult.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/resume/requests/:id/seen (Admin only)
 */
exports.markResumeRequestSeen = async (req, res, next) => {
  try {
    // Authenticate admin session
    let token = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : null;
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== "admin") {
      return next(createError(401, "Not authorized to update resume request"));
    }

    const id = req.params.id || req.body.id;
    const seenStatus = req.body.seen !== undefined ? Boolean(req.body.seen) : true;

    if (!id) {
      return next(createError(400, "Invalid Id"));
    }

    const sql = "UPDATE resume_requests SET seen = $1 WHERE id = $2 RETURNING *";
    const dbResult = await db.query(sql, [seenStatus, id]);

    return res.status(200).json({
      success: true,
      message: "Resume request status updated successfully",
      data: dbResult.rows[0] || null
    });
  } catch (error) {
    next(error);
  }
};
