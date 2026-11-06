const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistant');

router.post('/chat', assistantController.chat);
router.get('/profile', assistantController.getProfile);

module.exports = router;

