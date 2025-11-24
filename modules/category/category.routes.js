const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("./category.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.get("/", getCategories);
router.delete("/:id", authMiddleware, deleteCategory);
router.put("/:id", authMiddleware, updateCategory);

module.exports = router;
