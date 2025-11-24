const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");

// Create a new subcategory
const createSubcategory = async (req, res) => {
  try {
    const { name, category, image } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const newSubcategory = await Subcategory.create({
      name,
      category,
      image,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: newSubcategory,
    });
  } catch (error) {
    console.error("Create subcategory error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all subcategories
const getSubcategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { name, category, image } = req.body;

    const updated = await Subcategory.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, category: category || null, image },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubcategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
