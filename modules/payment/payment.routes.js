const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const { createPaymentIntent } = require("./payment.controller");
const { createPaymentValidator } = require("./payment.validator");
const validate = require("../../middleware/validate.middleware");

// Create Payment Intent
router.post("/create-payment-intent", authMiddleware, createPaymentValidator, validate, createPaymentIntent);

module.exports = router;
