const express = require("express");
const router = express.Router();
const { atCallback } = require("../controllers/smsController");

// Africa's Talking callbacks: they may send form-encoded or JSON; mount both
router.post("/callback", express.urlencoded({ extended: false }), atCallback);
router.post("/callback/json", express.json(), atCallback);

// Debug: lookup reminder by provider messageId
const { getByProviderMessageId } = require('../controllers/smsController');
router.get('/reminder/:messageId', getByProviderMessageId);

module.exports = router;
