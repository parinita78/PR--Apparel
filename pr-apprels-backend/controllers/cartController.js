// ─── Cart Controller ───────────────────────────────────────────────────────────
// In-memory cart store (in production, use a database or Redis)
const carts = {};
const { products } = require("../config/data");

// GET /api/cart/:sessionId
const getCart = (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = carts[sessionId] || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, data: cart, total, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/cart/:sessionId/add
const addToCart = (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, quantity = 1 } = req.body;

    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (!product.inStock) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    if (!carts[sessionId]) carts[sessionId] = [];

    const existing = carts[sessionId].find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      carts[sessionId].push({ ...product, quantity });
    }

    const total = carts[sessionId].reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, message: "Added to cart", data: carts[sessionId], total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/cart/:sessionId/update
const updateCartItem = (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, quantity } = req.body;

    if (!carts[sessionId]) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    if (quantity <= 0) {
      carts[sessionId] = carts[sessionId].filter((i) => i.id !== parseInt(productId));
    } else {
      const item = carts[sessionId].find((i) => i.id === parseInt(productId));
      if (item) item.quantity = quantity;
    }

    const total = carts[sessionId].reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, data: carts[sessionId], total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/cart/:sessionId/remove/:productId
const removeFromCart = (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    if (carts[sessionId]) {
      carts[sessionId] = carts[sessionId].filter((i) => i.id !== parseInt(productId));
    }
    const total = (carts[sessionId] || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, data: carts[sessionId] || [], total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/cart/:sessionId/clear
const clearCart = (req, res) => {
  try {
    const { sessionId } = req.params;
    carts[sessionId] = [];
    res.json({ success: true, message: "Cart cleared", data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
