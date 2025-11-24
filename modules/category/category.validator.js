const { body, param } = require("express-validator");

const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid string URL"),
];

const updateCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid string URL"),
];

const deleteCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID"),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
