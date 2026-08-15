const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact");

router.post('/', contactController.postMessage);
router.get('/', contactController.getMessages);
router.get('/:id', contactController.getMessage);
router.patch('/mark_as_seen/:id', contactController.seen);

module.exports = router;