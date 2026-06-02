// ─── Shop Page ────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, materials, occasions } from "../data/products";
import ProductCard from "../components/ProductCard";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Filter State ──────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 7000]);
  const [sortBy, setSortBy] = useState("default");

  const searchQuery = searchParams.get("search") || "";

  // Sync category from URL param
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // ── Toggle Helpers ────────────────────────────────────────────────────────
  const toggleMaterial = (mat) =>
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat],
    );

  const toggleOccasion = (occ) =>
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ],
    );

  // ── Filter + Sort Logic ───────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter — checks name, material, category, description
    if (searchQuery)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    // Category filter
    if (selectedCategory !== "all")
      result = result.filter((p) => p.category === selectedCategory);

    // Material filter
    if (selectedMaterials.length > 0)
      result = result.filter((p) => selectedMaterials.includes(p.material));

    // Occasion filter
    if (selectedOccasions.length > 0)
      result = result.filter((p) =>
        p.occasion?.some((o) => selectedOccasions.includes(o)),
      );

    // Price range filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedMaterials,
    selectedOccasions,
    priceRange,
    sortBy,
  ]);

  // ── Reset All Filters ─────────────────────────────────────────────────────
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedMaterials([]);
    setSelectedOccasions([]);
    setPriceRange([0, 7000]);
    setSortBy("default");
  };

  // Count active filters for badge
  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedMaterials.length +
    selectedOccasions.length +
    (priceRange[0] > 0 || priceRange[1] < 7000 ? 1 : 0);

  // ── Filter Panel (reused for desktop sidebar + mobile drawer) ─────────────
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#8b6f5e] font-semibold mb-3">
          Category
        </h4>
        <div className="space-y-2">
          {[
            { value: "all", label: "All Products" },
            { value: "semi-stitched", label: "Semi-Stitched" },
            { value: "unstitched", label: "Unstitched" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedCategory === opt.value
                    ? "bg-[#3d2b1f] border-[#3d2b1f]"
                    : "border-[#c9a882] group-hover:border-[#8b6f5e]"
                }`}
                onClick={() => setSelectedCategory(opt.value)}
              >
                {selectedCategory === opt.value && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#5a4a3a]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#8b6f5e] font-semibold mb-3">
          Material
        </h4>
        <div className="space-y-2">
          {materials.map((mat) => (
            <label
              key={mat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedMaterials.includes(mat)
                    ? "bg-[#3d2b1f] border-[#3d2b1f]"
                    : "border-[#c9a882] group-hover:border-[#8b6f5e]"
                }`}
                onClick={() => toggleMaterial(mat)}
              >
                {selectedMaterials.includes(mat) && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#5a4a3a]">{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#8b6f5e] font-semibold mb-3">
          Price Range
        </h4>
        <div className="flex items-center justify-between text-xs text-[#8b6f5e] mb-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
        <input
          type="range"
          min={0}
          max={7000}
          step={100}
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full accent-[#c9a882]"
        />
        <div className="flex justify-between text-xs text-[#a89880] mt-1">
          <span>₹0</span>
          <span>₹7,000</span>
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-[#8b6f5e] font-semibold mb-3">
          Occasion
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => toggleOccasion(occ)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${
                selectedOccasions.includes(occ)
                  ? "bg-[#3d2b1f] text-white border-[#3d2b1f]"
                  : "border-[#ddd5c8] text-[#8b6f5e] hover:border-[#c9a882] hover:text-[#3d2b1f]"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button — only shown when filters are active */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full text-xs uppercase tracking-widest text-[#8b6f5e] border border-[#c9a882] py-2 rounded-lg hover:bg-[#f0ebe3] transition-colors"
        >
          Reset Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-20 lg:pt-24">
      {/* Page Header */}
      <div className="bg-white border-b border-[#ede8e0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif text-[#3d2b1f]">
            {searchQuery ? `Results for "${searchQuery}"` : "Shop All Suits"}
          </h1>
          <p className="text-sm text-[#8b6f5e] mt-1">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar Filters ── */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-[#ede8e0] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#3d2b1f] uppercase tracking-widest mb-5">
                Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: mobile filter button + sort dropdown */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm text-[#3d2b1f] bg-white border border-[#ede8e0] rounded-full px-4 py-2 shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-[#c9a882] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Active filter chips (desktop) */}
              <div className="hidden lg:flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <span className="flex items-center gap-1.5 text-xs bg-[#f0ebe3] text-[#8b6f5e] px-3 py-1 rounded-full border border-[#ddd5c8]">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="hover:text-rose-400"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedMaterials.map((m) => (
                  <span
                    key={m}
                    className="flex items-center gap-1.5 text-xs bg-[#f0ebe3] text-[#8b6f5e] px-3 py-1 rounded-full border border-[#ddd5c8]"
                  >
                    {m}
                    <button
                      onClick={() => toggleMaterial(m)}
                      className="hover:text-rose-400"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {selectedOccasions.map((o) => (
                  <span
                    key={o}
                    className="flex items-center gap-1.5 text-xs bg-[#f0ebe3] text-[#8b6f5e] px-3 py-1 rounded-full border border-[#ddd5c8]"
                  >
                    {o}
                    <button
                      onClick={() => toggleOccasion(o)}
                      className="hover:text-rose-400"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-auto text-sm border border-[#ede8e0] bg-white text-[#3d2b1f] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a882]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🧵</p>
                <h3 className="text-lg font-serif text-[#3d2b1f] mb-2">
                  No products found
                </h3>
                <p className="text-sm text-[#8b6f5e] mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-sm text-white bg-[#3d2b1f] px-6 py-2.5 rounded-full hover:bg-[#8b6f5e] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-[#3d2b1f]">
                Filters
              </h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-[#8b6f5e]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full py-3 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest rounded-xl font-semibold hover:bg-[#8b6f5e] transition-colors"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
