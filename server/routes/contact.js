const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact");

router.post('/', contactController.sendMessage);
router.get('/', contactController.getMessages);
router.get('/:id', contactController.getMessage);