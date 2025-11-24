const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const { productUpload } = require("../../modules/upload/upload.controller");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  validateProduct,
} = require("./product.controller");
const {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("./product.validator");
const validate = require("../../middleware/validate.middleware");

// Multer upload fields for product images
const uploadFields = productUpload.fields([
  { name: "featureImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

// Routes
router.post(
  "/",
  authMiddleware,
  uploadFields,
  createProductValidator,
  validate,
  createProduct
);

router.post(
  "/validate",
  validateProduct
);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.put(
  "/:id",
  authMiddleware,
  uploadFields,
  updateProductValidator,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProductValidator,
  validate,
  deleteProduct
);

module.exports = router;
