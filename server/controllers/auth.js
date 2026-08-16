const db = require("../config/connection");
const createError = require("http-errors");
const {
  ADMIN_COOKIE_NAME,
  OWNER_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  OWNER_COOKIE_OPTIONS,
  generateAdminToken,
  generateOwnerToken,
  verifyToken
} = require("../middleware/auth");

exports.login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email == null || email.trim() === "") {
      return next(createError(400, "Email is required"));
    }
    if (password == null || password.trim() === "") {
      return next(createError(400, "Password is required"));
    }

    const sql = "SELECT id, name, email FROM users WHERE email = $1 AND password = $2";

    db.query(sql, [email.trim(), password], (err, result) => {
      if (err) {
        return next(err);
      }
      if (!result.rows || result.rows.length === 0) {
        return next(createError(401, "Invalid email or password"));
      }
      const user = result.rows[0];

      // 1. Admin auth session cookie (cleared on logout)
      const adminToken = generateAdminToken(user);
      res.cookie(ADMIN_COOKIE_NAME, adminToken, ADMIN_COOKIE_OPTIONS);

      // 2. Permanent analytics owner cookie (remains after logout)
      const ownerToken = generateOwnerToken(user);
      res.cookie(OWNER_COOKIE_NAME, ownerToken, OWNER_COOKIE_OPTIONS);

      return res.status(200).json({
        message: "User authenticated successfully",
        user
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.me = (req, res, next) => {
  try {
    let token = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : null;
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== "admin") {
      return next(createError(401, "Not authenticated"));
    }
    return res.status(200).json({
      id: decoded.userId,
      email: decoded.email,
      role: "admin"
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    // Clear ONLY the admin authentication session cookie.
    // DO NOT clear the analytics_owner cookie so owner visits remain excluded.
    res.clearCookie(ADMIN_COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    next(error);
  }
};