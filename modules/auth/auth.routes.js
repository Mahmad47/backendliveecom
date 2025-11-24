// modules/auth/auth.routes.js
const express = require("express");
const { signup, login, updateUser, updatePassword } = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const { upload } = require("../../modules/upload/upload.controller");
const { updateProfileValidator, updatePasswordValidator } = require("./auth.validator");
const validate = require("../../middleware/validate.middleware");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.put("/users/:id", authMiddleware, upload.single("avatar"), updateProfileValidator, validate, updateUser);
router.put("/users/:id/password", authMiddleware, updatePasswordValidator, validate, updatePassword);

module.exports = router;
