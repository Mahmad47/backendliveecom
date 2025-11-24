const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    if (req.header("Authorization")?.startsWith("Bearer ")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    // 2. Fallback: check cookie
    else if (req.cookies && req.cookies["auth-user"]) {
      const authCookie = JSON.parse(req.cookies["auth-user"]);
      token = authCookie.token;
    }

    if (!token) return res.status(401).json({ message: "No token, auth denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId || decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found, auth failed" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;