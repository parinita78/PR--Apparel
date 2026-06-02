// ─── Order Routes ─────────────────────────────────────────────────────────────
const express = require("express");
const orderRouter = express.Router();
const { placeOrder, getAllOrders, getOrderById } = require("../controllers/orderController");

orderRouter.post("/", placeOrder);             // POST /api/orders
orderRouter.get("/", getAllOrders);            // GET  /api/orders
orderRouter.get("/:orderId", getOrderById);   // GET  /api/orders/:orderId

// ─── Chat Routes ──────────────────────────────────────────────────────────────
const chatRouter = express.Router();
const { chat } = require("../controllers/chatController");

chatRouter.post("/", chat);                   // POST /api/chat

module.exports = { orderRouter, chatRouter };
