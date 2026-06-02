// ─── Products Controller ───────────────────────────────────────────────────────
const { products, categories, materials, occasions } = require("../config/data");

// GET /api/products — Get all products with optional filters
const getAllProducts = (req, res) => {
  try {
    let result = [...products];

    const { category, material, occasion, minPrice, maxPrice, sort, search, inStock } = req.query;

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category && category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Filter by material
    if (material) {
      const mats = material.split(",");
      result = result.filter((p) => mats.includes(p.material));
    }

    // Filter by occasion
    if (occasion) {
      const occs = occasion.split(",");
      result = result.filter((p) => p.occasion?.some((o) => occs.includes(o)));
    }

    // Filter by price range
    if (minPrice) result = result.filter((p) => p.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseInt(maxPrice));

    // Filter by stock
    if (inStock === "true") result = result.filter((p) => p.inStock);

    // Sorting
    switch (sort) {
      case "price-asc":   result.sort((a, b) => a.price - b.price); break;
      case "price-desc":  result.sort((a, b) => b.price - a.price); break;
      case "rating":      result.sort((a, b) => b.rating - a.rating); break;
      case "reviews":     result.sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/products/:id — Get single product
const getProductById = (req, res) => {
  try {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Get related products (same category, different product)
    const related = products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);

    res.json({ success: true, data: product, related });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/products/featured — Get featured products
const getFeaturedProducts = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const featured = products.slice(0, limit);
    res.json({ success: true, count: featured.length, data: featured });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/categories — Get all categories
const getCategories = (req, res) => {
  try {
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/materials — Get all materials
const getMaterials = (req, res) => {
  try {
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/occasions — Get all occasions
const getOccasions = (req, res) => {
  try {
    res.json({ success: true, data: occasions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getMaterials,
  getOccasions,
};
