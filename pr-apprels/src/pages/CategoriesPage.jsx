// ─── Categories Page ──────────────────────────────────────────────────────────
import React from "react";
import { Link } from "react-router-dom";
import { categories, materials, products } from "../data/products";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-white border-b border-[#ede8e0] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8b6f5e]">Explore</span>
          <h1 className="text-4xl font-serif text-[#3d2b1f] mt-2">Our Collections</h1>
          <p className="text-sm text-[#8b6f5e] mt-3 max-w-lg mx-auto">
            Handpicked fabrics across two distinct categories — find your perfect match for every occasion.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d2b1f]/90 via-[#3d2b1f]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs uppercase tracking-widest text-[#c9a882] font-medium">{cat.count} Products</span>
                <h2 className="text-3xl font-serif text-white mt-1">{cat.label}</h2>
                <p className="text-sm text-[#c9b8a8] mt-1">{cat.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-white/30 group-hover:bg-[#c9a882] group-hover:border-[#c9a882] transition-all duration-300">
                  Shop {cat.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Shop by Material */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-[#8b6f5e]">Browse</span>
            <h2 className="text-2xl font-serif text-[#3d2b1f] mt-1">Shop by Material</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {materials.map((mat) => {
              const count = products.filter((p) => p.material === mat).length;
              return (
                <Link
                  key={mat}
                  to={`/shop?material=${mat}`}
                  className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[#ede8e0] hover:border-[#c9a882] hover:shadow-md transition-all duration-300 text-center"
                >
                  <span className="text-3xl mb-2">🧶</span>
                  <h3 className="text-sm font-semibold text-[#3d2b1f] group-hover:text-[#8b6f5e] transition-colors">{mat}</h3>
                  <p className="text-xs text-[#a89880] mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
