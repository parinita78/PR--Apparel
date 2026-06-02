// ─── Product Routes ────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getMaterials,
  getOccasions,
} = require("../controllers/productController");

router.get("/", getAllProducts);                // GET /api/products
router.get("/featured", getFeaturedProducts);  // GET /api/products/featured
router.get("/categories", getCategories);      // GET /api/products/categories
router.get("/materials", getMaterials);        // GET /api/products/materials
router.get("/occasions", getOccasions);        // GET /api/products/occasions
router.get("/:id", getProductById);            // GET /api/products/:id

module.exports = router;
