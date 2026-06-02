// ─── Product Details Page ─────────────────────────────────────────────────────
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const product = products.find((p) => p.id === parseInt(id));
  const related = products.filter((p) => p.id !== product?.id && p.category === product?.category).slice(0, 4);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] pt-20">
        <div className="text-center">
          <p className="text-5xl mb-4">🧵</p>
          <h2 className="text-xl font-serif text-[#3d2b1f] mb-2">Product not found</h2>
          <Link to="/shop" className="text-sm text-[#8b6f5e] underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const inCart = cart.some((i) => i.id === product.id);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-[#8b6f5e]">
          <Link to="/" className="hover:text-[#3d2b1f] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#3d2b1f] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#3d2b1f] truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#f5f0e8] relative">
              <img
                src={product.images?.[activeImg] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-[#c9a882] text-white uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 text-xs font-bold bg-white text-rose-500 px-2.5 py-1 rounded-full border border-rose-200">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-[#c9a882]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="py-2">
            <span className="inline-block text-xs uppercase tracking-widest text-[#8b6f5e] bg-[#f0ebe3] px-3 py-1 rounded-full mb-3 capitalize">
              {product.category} · {product.material}
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#3d2b1f] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-[#ddd5c8]"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[#8b6f5e]">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#3d2b1f]">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-[#a89880] line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-rose-500">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#5a4a3a] leading-relaxed mb-8 border-l-2 border-[#c9a882] pl-4">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-400" : "bg-rose-400"}`} />
              <span className={`text-sm font-medium ${product.inStock ? "text-emerald-600" : "text-rose-500"}`}>
                {product.inStock ? "In Stock – Ready to Ship" : "Currently Out of Stock"}
              </span>
            </div>

            {/* Quantity selector */}
            {product.inStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-[#5a4a3a] font-medium">Quantity:</span>
                <div className="flex items-center border border-[#ddd5c8] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#5a4a3a] hover:bg-[#f0ebe3] transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-[#3d2b1f]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#5a4a3a] hover:bg-[#f0ebe3] transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 text-sm uppercase tracking-widest font-bold rounded-full transition-all duration-300 ${
                  !product.inStock
                    ? "bg-[#f0ebe3] text-[#a89880] cursor-not-allowed"
                    : added
                    ? "bg-emerald-400 text-white scale-95"
                    : "bg-[#3d2b1f] text-white hover:bg-[#8b6f5e] hover:scale-[1.02]"
                }`}
              >
                {!product.inStock ? "Out of Stock" : added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              {inCart && (
                <button
                  onClick={() => navigate("/cart")}
                  className="px-6 py-4 border-2 border-[#3d2b1f] text-[#3d2b1f] text-sm uppercase tracking-widest font-bold rounded-full hover:bg-[#3d2b1f] hover:text-white transition-all duration-300"
                >
                  View Cart
                </button>
              )}
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "100% Authentic" },
                { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label: "Safe Packaging" },
                { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Secure Payment" },
                { icon: "M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z", label: "Easy Returns" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 bg-[#f5f0e8] rounded-xl px-3 py-2.5">
                  <svg className="w-4 h-4 text-[#c9a882]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                  </svg>
                  <span className="text-xs text-[#5a4a3a] font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif text-[#3d2b1f] mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
