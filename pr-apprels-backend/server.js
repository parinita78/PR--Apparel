// ─── PR Apprels — Express.js Backend Server ───────────────────────────────────
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

// Routes
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const { orderRouter, chatRouter } = require("./routes/otherRoutes");

// Middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan("dev"));

// CORS — only allow React frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many chat requests. Please wait a few minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Limit login/register attempts
  message: {
    success: false,
    message: "Too many auth attempts. Please try again later.",
  },
});

app.use("/api/", generalLimiter);
app.use("/api/chat", chatLimiter);
app.use("/api/auth", authLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🧵 PR Apprels Backend is running!",
    version: "2.0.0",
    database: "MongoDB Atlas",
    endpoints: {
      // Auth
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      getMe: "GET  /api/auth/me",
      updateUser: "PUT  /api/auth/update",
      addAddress: "POST /api/auth/address",
      delAddress: "DELETE /api/auth/address/:id",
      // Products
      products: "GET  /api/products",
      featured: "GET  /api/products/featured",
      product: "GET  /api/products/:id",
      // Cart
      cart: "GET  /api/cart/:sessionId",
      addCart: "POST /api/cart/:sessionId/add",
      // Orders
      placeOrder: "POST /api/orders",
      getOrder: "GET  /api/orders/:orderId",
      // Chat
      chat: "POST /api/chat",
    },
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRouter);
app.use("/api/chat", chatRouter);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🧵  PR Apprels Backend Running!        ║
  ║   📍  http://localhost:${PORT}             ║
  ║   🗄️   MongoDB Atlas Connected           ║
  ║   🌿  Mode: ${process.env.NODE_ENV || "development"}                ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
