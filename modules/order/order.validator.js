const { body, param } = require("express-validator");

// Validate creating an order
const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items array is required and cannot be empty"),
  body("items.*.product")
    .isMongoId()
    .withMessage("Each item must have a valid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("total")
    .isNumeric()
    .withMessage("Total price must be a number"),
];

// Validate order status update
const updateOrderStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),
  body("status")
    .isIn(["pending", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
};
