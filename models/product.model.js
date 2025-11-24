const mongoose =  require("mongoose");

const productSchema = new mongoose.Schema({
   name: { type: String, required: true, trim: true },
  shortDescription: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  featureImage: { type: String },
  galleryImages: [{ type: String }],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
