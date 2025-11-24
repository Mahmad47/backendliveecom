require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Database connection
const connectDB = require("./config/db");

// Routers
const authRouter = require("./modules/auth/auth.routes");
const categoryRoutes = require("./modules/category/category.routes");
const subcategoryRoutes = require("./modules/subcategory/subcategory.routes");
const productRoutes = require("./modules/product/product.routes");
const orderRoutes = require("./modules/order/order.routes");
const paymentRoutes = require("./modules/payment/payment.routes");

// Middlewares
const errorHandler = require("./middleware/error.middleware");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

// ------------------ Connect to MongoDB ------------------
connectDB();

// ------------------ Global Middleware ------------------
app.use(helmet()); // secure HTTP headers

app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5173",
      "https://my-store-blond.vercel.app",
    ],
    credentials: true, // if you use cookies / auth headers
  })
);
app.use(express.json()); // parse JSON body

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per window per IP
});
app.use(limiter);

// ------------------ Static Files ------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ API Routes ------------------
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subcategoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

// ------------------ Health Check ------------------
app.get("/api/health", (_, res) =>
  res.json({ status: "OK", message: "Server running fine" })
);

// ------------------ 404 Fallback ------------------
app.use("*", (_, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ------------------ Global Error Handler ------------------
app.use(errorHandler);

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`✅ Server running on ${HOST}`);
});
