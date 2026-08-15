const crypto = require("crypto");
const db = require("../config/connection");

/**
 * Record a page view and create/update anonymous visitor session
 */
exports.trackPageView = async (req, res, next) => {
  try {
    let visitorId = req.cookies ? req.cookies.visitor_id : null;
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      isNewVisitor = true;
      res.cookie("visitor_id", visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        sameSite: "lax"
      });
    }

    const page = (req.body && req.body.page && typeof req.body.page === 'string')
      ? req.body.page.trim()
      : "/";

    // Insert or update visitor timestamp
    await db.query(
      `INSERT INTO visitors (visitor_id, first_seen, last_seen)
       VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (visitor_id)
       DO UPDATE SET last_seen = CURRENT_TIMESTAMP`,
      [visitorId]
    );

    // Record page visit
    await db.query(
      `INSERT INTO page_views (visitor_id, page, viewed_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [visitorId, page]
    );

    return res.status(200).json({
      success: true,
      visitor_id: visitorId,
      page: page,
      isNewVisitor: isNewVisitor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unique visitor count and total page views for admin page
 */
exports.getStats = async (req, res, next) => {
  try {
    const totalViewsRes = await db.query(
      "SELECT COUNT(*)::int AS count FROM page_views"
    );
    const totalViews = totalViewsRes.rows[0] ? totalViewsRes.rows[0].count : 0;

    const uniqueVisitorsRes = await db.query(
      "SELECT COUNT(DISTINCT visitor_id)::int AS count FROM page_views"
    );
    const uniqueVisitors = uniqueVisitorsRes.rows[0] ? uniqueVisitorsRes.rows[0].count : 0;

    return res.status(200).json({
      totalViews,
      uniqueVisitors
    });
  } catch (error) {
    next(error);
  }
};
