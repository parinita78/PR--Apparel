// ─── ProductCard Component ────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BADGE_COLORS = {
  Sale: "bg-rose-400 text-white",
  New: "bg-emerald-400 text-white",
  Bestseller: "bg-amber-400 text-white",
  Premium: "bg-purple-400 text-white",
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-[#ddd5c8]"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-xs text-[#a89880] ml-1">({rating})</span>
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const inCart = cart.some((i) => i.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#ede8e0]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* ── Image ── */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-[#f5f0e8]">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-4 py-1.5 bg-white text-[#8b6f5e] text-xs font-semibold uppercase tracking-widest rounded-full border border-[#c9a882]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              BADGE_COLORS[product.badge] || "bg-[#c9a882] text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Discount % */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-xs font-bold bg-white text-rose-500 px-2 py-1 rounded-full border border-rose-200">
            -{discount}%
          </span>
        )}

        {/* Quick action – View Details */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#3d2b1f]/80 text-white text-center text-xs uppercase tracking-widest py-2.5 font-medium transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          View Details
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#3d2b1f] leading-tight group-hover:text-[#8b6f5e] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <span className="inline-block text-xs text-[#a89880] bg-[#f5f0e8] px-2 py-0.5 rounded-full mb-2 capitalize">
          {product.material} · {product.category}
        </span>

        <StarRating rating={product.rating} />

        {/* Pricing */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-[#3d2b1f]">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#a89880] line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`mt-3 w-full py-2.5 text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 ${
            !product.inStock
              ? "bg-[#f0ebe3] text-[#a89880] cursor-not-allowed"
              : added
              ? "bg-emerald-400 text-white scale-95"
              : inCart
              ? "bg-[#c9a882]/20 text-[#8b6f5e] border border-[#c9a882] hover:bg-[#c9a882] hover:text-white"
              : "bg-[#3d2b1f] text-[#f5f0e8] hover:bg-[#8b6f5e] hover:scale-[1.02]"
          }`}
        >
          {!product.inStock ? "Out of Stock" : added ? "✓ Added!" : inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
