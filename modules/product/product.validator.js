const { body, param } = require("express-validator");

const createProductValidator = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").optional().isNumeric().withMessage("Stock must be a number"),
  body("category").notEmpty().isMongoId().withMessage("Valid category is required"),
  body("subcategory").optional().isMongoId().withMessage("Invalid subcategory ID"),
];

const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("stock").optional().isNumeric().withMessage("Stock must be a number"),
];

const deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
