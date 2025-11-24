const { body, param } = require("express-validator");

const createSubcategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long"),

  body("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid string URL"),
];

const updateSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid string URL"),
];

const deleteSubcategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory ID"),
];

module.exports = {
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
};
