const express = require("express");
const {
  createSubcategory,
  getSubcategory,
  deleteSubcategory,
  updateSubcategory,
} = require("./subcategory.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("./subcategory.validator");

const router = express.Router();

router.post("/", authMiddleware, createSubcategoryValidator, validate, createSubcategory);
router.get("/", getSubcategory);
router.put("/:id", authMiddleware, updateSubcategoryValidator, validate, updateSubcategory);
router.delete("/:id", authMiddleware, deleteSubcategoryValidator, validate, deleteSubcategory);

module.exports = router;
