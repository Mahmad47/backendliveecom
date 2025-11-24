const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("./order.controller");

const { createOrderValidator, updateOrderStatusValidator } = require("./order.validator");
const validate = require("../../middleware/validate.middleware");

// Routes
router.post("/", authMiddleware, createOrderValidator, validate, createOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/", authMiddleware, getAllOrders);
router.put("/:id", authMiddleware, updateOrderStatusValidator, validate, updateOrderStatus);

module.exports = router;
