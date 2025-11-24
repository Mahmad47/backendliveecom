const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const generateToken = require("../../utils/generateToken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    user.password = undefined;

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // if (!name || !email || !password) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password: password });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id.toString() !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const normalizeName = req.body.name
      ? req.body.name.replace(/\s+/g, " ")
      : undefined;

    const updateFields = {
      name: normalizeName,
      email: req.body.email,
      age: req.body.age ? Number(req.body.age) : undefined,
      phone: req.body.phone ? Number(req.body.phone) : undefined,
    };

    if (req.body.password && req.body.password.trim() !== "") {
      updateFields.password = await bcrypt.hash(req.body.password.trim(), 10);
    }

    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id.toString() !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new passwords are required",
      });
    }

    const user = await User.findById(id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword.trim(); // pre-save hook re-hashes
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
