const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/tracking");

router.post("/", trackingController.trackPageView);
router.get("/stats", trackingController.getStats);

module.exports = router;
