const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume");

// Public route to submit resume request
router.post("/request", resumeController.postResumeRequest);

// Public alias route
router.post("/", resumeController.postResumeRequest);

// Admin route to retrieve all resume requests
router.get("/requests", resumeController.getResumeRequests);

module.exports = router;
