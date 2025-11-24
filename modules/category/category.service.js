// modules/category/category.service.js
const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");

exports.createCategory = async (data) => {
  const newCategory = new Category({
    ...data
  });
  return newCategory.save();
};

exports.getCategories = async () => {
  return Category.find().sort({ createdAt: -1 });
};

exports.updateCategory = async (id, data, userId) => {
  return Category.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true }
  );
};

exports.deleteCategory = async (id, userId) => {
  await Subcategory.deleteMany({ category: id });
  return Category.findOneAndDelete({ _id: id, user: userId });
};
