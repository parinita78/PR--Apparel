// ─── Cart Routes ──────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.get("/:sessionId", getCart);                          // GET  /api/cart/:sessionId
router.post("/:sessionId/add", addToCart);                   // POST /api/cart/:sessionId/add
router.put("/:sessionId/update", updateCartItem);            // PUT  /api/cart/:sessionId/update
router.delete("/:sessionId/remove/:productId", removeFromCart); // DELETE /api/cart/:sessionId/remove/:productId
router.delete("/:sessionId/clear", clearCart);               // DELETE /api/cart/:sessionId/clear

module.exports = router;
