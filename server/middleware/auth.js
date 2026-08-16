const crypto = require("crypto");

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || "portfolio-admin-secret-key-2026-rithish";

const ADMIN_COOKIE_NAME = "admin_token";
const OWNER_COOKIE_NAME = "analytics_owner";

const isProduction = process.env.NODE_ENV === "production";

const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "lax",
  path: "/",
  secure: isProduction
};

const OWNER_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  sameSite: "lax",
  path: "/",
  secure: isProduction
};

/**
 * Generate HMAC signed token
 */
function createSignedToken(type, payloadData = {}) {
  const payloadObj = {
    type,
    ...payloadData,
    timestamp: Date.now()
  };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

function generateAdminToken(user) {
  const userId = user && user.id ? user.id : 1;
  const email = user && user.email ? user.email : "admin@portfolio";
  return createSignedToken("admin", { userId, email });
}

function generateOwnerToken(user) {
  const userId = user && user.id ? user.id : 1;
  const email = user && user.email ? user.email : "admin@portfolio";
  return createSignedToken("owner", { userId, email, owner: true });
}

/**
 * Verify signed token
 */
function verifyToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  const [payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");

  try {
    const sigBuffer = Buffer.from(signature, "hex");
    const expBuffer = Buffer.from(expectedSignature, "hex");
    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return null;
    }
    const decodedJson = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(decodedJson);
  } catch (err) {
    return null;
  }
}

/**
 * Check if incoming request has a valid analytics_owner token
 */
function isOwnerRequest(req) {
  const token = req.cookies ? req.cookies[OWNER_COOKIE_NAME] : null;
  if (!token) return false;
  const decoded = verifyToken(token);
  return Boolean(decoded && decoded.type === "owner");
}

/**
 * Check if tracked page path is an admin route (/admin or /admin/*)
 */
function isAdminRoute(page) {
  if (!page || typeof page !== "string") return false;
  const cleanPage = page.trim().toLowerCase();
  return cleanPage === "/admin" || cleanPage.startsWith("/admin/");
}

module.exports = {
  ADMIN_COOKIE_NAME,
  OWNER_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  OWNER_COOKIE_OPTIONS,
  generateAdminToken,
  generateOwnerToken,
  verifyToken,
  isOwnerRequest,
  isAdminRoute
};
