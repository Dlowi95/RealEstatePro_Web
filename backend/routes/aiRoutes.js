const express = require("express");
const router = express.Router();
const { chatAssistant } = require("../controllers/aiController");

router.post("/chat-assistant", chatAssistant);

module.exports = router;