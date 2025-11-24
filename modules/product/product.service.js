const Product = require("../../models/product.model");

exports.createProduct = async (data) => {
  const product = new Product(data);
  await product.save();
  return product;
};

exports.getProductById = async (id) => {
  return Product.findById(id).populate("category").populate("subcategory");
};

exports.deleteProduct = async (id, userId) => {
  return Product.findOneAndDelete({ _id: id, user: userId });
};
