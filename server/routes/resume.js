const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume");

// Public route to submit resume request
router.post("/request", resumeController.postResumeRequest);

// Public alias route
router.post("/", resumeController.postResumeRequest);

// Admin route to retrieve resume requests (supports ?filter=unseen|seen|all)
router.get("/requests", resumeController.getResumeRequests);

// Admin route to mark resume request as seen / unseen
router.patch("/requests/:id/seen", resumeController.markResumeRequestSeen);
router.put("/requests/:id/seen", resumeController.markResumeRequestSeen);

module.exports = router;
