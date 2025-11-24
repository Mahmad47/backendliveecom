const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");
const categoryService = require("./category.service");

/**
 * Create a new category
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await categoryService.createCategory({
      name,
      user: req.user.id,
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a category by ID
 */
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleted = await categoryService.deleteCategory(categoryId, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found or not authorized" });
    }

    // Cascade delete subcategories
    await Subcategory.deleteMany({ category: categoryId });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update category details
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.user.id,
      { name, image }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
