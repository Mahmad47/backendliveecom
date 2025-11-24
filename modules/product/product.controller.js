const Product = require("../../models/product.model");
const fs = require("fs");
const path = require("path");
const productService = require("./product.service");
const mongoose = require('mongoose');

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const featureImage = req.files?.featureImage
      ? `/uploads/products/${req.files.featureImage[0].filename}`
      : null;

    const galleryImages = req.files?.galleryImages
      ? req.files.galleryImages.map((file) => `/uploads/products/${file.filename}`)
      : [];

    const productData = {
      ...req.body,
      user: req.user.id,
      featureImage,
      galleryImages,
    };

    const product = await productService.createProduct(productData);
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get products with filters, pagination, and search
exports.getProducts = async (req, res) => {
  try {
    const { category, subCategory, search, page = 1, limit = 6 } = req.query;

    const filter = {};
    if (category) filter.category = { $in: category.split(",") };
    if (subCategory) filter.subcategory = { $in: subCategory.split(",") };
    if (search?.trim()) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter)
      .populate("category")
      .populate("subcategory")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updateData = {
      name: req.body.name,
      price: Number(req.body.price) || 0,
      stock: Number(req.body.stock) || 0,
      category: req.body.category,
      subcategory: req.body.subcategory || null,
      description: req.body.description || "",
      shortDescription: req.body.shortDescription || "",
    };

    // Handle feature image replacement
    if (req.files?.featureImage?.[0]) {
      if (product.featureImage) {
        try {
          const oldPath = path.join(process.cwd(), "public", product.featureImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Failed to delete old feature image:", e);
        }
      }
      updateData.featureImage = `/uploads/products/${req.files.featureImage[0].filename}`;
    }

    // Handle gallery images
    let existingGalleryImages = [];
    if (req.body.existingGalleryImages) {
      try {
        existingGalleryImages = JSON.parse(req.body.existingGalleryImages);
      } catch (e) {
        console.error("Failed to parse existingGalleryImages", e);
      }
    }

    let newGalleryImages = [];
    if (req.files?.galleryImages) {
      newGalleryImages = req.files.galleryImages.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    updateData.galleryImages = [...existingGalleryImages, ...newGalleryImages];

    const updatedProduct = await Product.findByIdAndUpdate(product._id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.validateProduct = async (req, res) => {
  try {
    const { items } = req.body; // array of product IDs
    const objectIds = items.map(id => new mongoose.Types.ObjectId(id));
    const validItems = await Product.find({
      _id: { $in: objectIds },
    });

    res.json({
      success: true,
      validItems,
    });
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
