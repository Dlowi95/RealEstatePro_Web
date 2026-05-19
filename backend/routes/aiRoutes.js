const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { chatAssistant } = require('../controllers/aiController');

router.post('/chat-assistant', chatAssistant);

module.exports = router;