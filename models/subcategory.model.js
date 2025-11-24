const mongoose =  require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);
