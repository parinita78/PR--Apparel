// ─── Auth Routes ──────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  removeAddress,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register); // POST /api/auth/register
router.post("/login", login); // POST /api/auth/login

// Protected routes (require JWT token)
router.get("/me", protect, getMe); // GET    /api/auth/me
router.put("/update", protect, updateProfile); // PUT    /api/auth/update
router.post("/address", protect, addAddress); // POST   /api/auth/address
router.delete("/address/:addressId", protect, removeAddress); // DELETE /api/auth/address/:id

module.exports = router;
