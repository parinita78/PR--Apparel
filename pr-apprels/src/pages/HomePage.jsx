// ─── Home Page ────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, categories} from "../data/products";
import ProductCard from "../components/ProductCard";

// ── Hero Banner ──────────────────────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#f5f0e8]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558171813-0a86b08e5a4e?w=1600&q=80"
          alt="Fashion hero"
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8] via-[#f5f0e8]/90 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div
            className={`flex items-center gap-3 mb-6 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="h-px w-10 bg-[#c9a882]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#8b6f5e] font-medium">New Collection 2024</span>
          </div>

          {/* Headline */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-serif text-[#3d2b1f] leading-[1.05] mb-6 transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Wear Your
            <br />
            <span className="text-[#c9a882] italic">Story</span>
          </h1>

          <p
            className={`text-base text-[#5a4a3a] leading-relaxed mb-8 max-w-md transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Discover curated semi-stitched and unstitched fabrics — woven with tradition, tailored for the modern woman.
          </p>

          {/* CTA buttons */}
          <div
            className={`flex flex-wrap gap-3 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3.5 bg-[#3d2b1f] text-[#f5f0e8] text-sm uppercase tracking-widest font-semibold rounded-full hover:bg-[#8b6f5e] hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate("/categories")}
              className="px-8 py-3.5 border border-[#3d2b1f] text-[#3d2b1f] text-sm uppercase tracking-widest font-semibold rounded-full hover:bg-[#3d2b1f] hover:text-white hover:scale-105 transition-all duration-300"
            >
              Explore Categories
            </button>
          </div>

          {/* Stats */}
          <div
            className={`mt-12 flex gap-8 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {[
              { value: "500+", label: "Fabric Designs" },
              { value: "10K+", label: "Happy Customers" },
              { value: "15+", label: "Years of Craft" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-serif font-bold text-[#3d2b1f]">{s.value}</p>
                <p className="text-xs text-[#8b6f5e] uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8b6f5e]">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#c9a882] to-transparent animate-pulse" />
      </div>
    </section>
  );
};

// ── Category Section ─────────────────────────────────────────────────────────
const CategorySection = () => (
  <section className="py-16 lg:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-[#8b6f5e]">Collections</span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#3d2b1f] mt-2">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d2b1f]/80 via-[#3d2b1f]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs uppercase tracking-widest text-[#c9a882] font-medium">{cat.count} Products</span>
              <h3 className="text-2xl font-serif text-white mt-1">{cat.label}</h3>
              <p className="text-sm text-[#c9b8a8] mt-1">{cat.description}</p>
              <span className="inline-flex items-center gap-2 mt-3 text-xs uppercase tracking-widest text-white border-b border-white/50 pb-0.5 group-hover:border-[#c9a882] group-hover:text-[#c9a882] transition-colors">
                Explore
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// ── Promotional Banner ───────────────────────────────────────────────────────
const PromoBanner = () => (
  <section className="py-12 bg-[#3d2b1f]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
        <div>
          <p className="text-[#c9a882] text-xs uppercase tracking-[0.3em] mb-1">Limited Time</p>
          <h3 className="text-2xl sm:text-3xl font-serif text-white">
            Get <span className="text-[#c9a882]">20% Off</span> on Your First Order
          </h3>
          <p className="text-[#a89880] text-sm mt-1">Use code <span className="font-mono font-bold text-white bg-[#5a4a3a] px-2 py-0.5 rounded">PRFIRST20</span></p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-[#c9a882] text-[#3d2b1f] text-sm uppercase tracking-widest font-bold rounded-full hover:bg-[#e8c99e] hover:scale-105 transition-all duration-300"
          >
            Claim Offer
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ── Testimonials ─────────────────────────────────────────────────────────────
// const Testimonials = () => (
//   <section className="py-16 lg:py-24 bg-[#fdfaf6]">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="text-center mb-12">
//         <span className="text-xs uppercase tracking-[0.3em] text-[#8b6f5e]">Reviews</span>
//         <h2 className="text-3xl sm:text-4xl font-serif text-[#3d2b1f] mt-2">What Our Customers Say</h2>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {testimonials.map((t) => (
//           <div key={t.id} className="bg-white rounded-2xl p-6 border border-[#ede8e0] shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex gap-1 mb-4">
//               {[...Array(t.rating)].map((_, i) => (
//                 <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//               ))}
//             </div>
//             <p className="text-sm text-[#5a4a3a] leading-relaxed italic">"{t.text}"</p>
//             <div className="flex items-center gap-3 mt-5">
//               <div className="w-9 h-9 bg-[#c9a882] rounded-full flex items-center justify-center text-white text-xs font-bold">
//                 {t.avatar}
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-[#3d2b1f]">{t.name}</p>
//                 <p className="text-xs text-[#a89880]">{t.location}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// ── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const featured = products.slice(0, 4);

  return (
    <div>
      <Hero />

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-[#fdfaf6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#8b6f5e]">Handpicked</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#3d2b1f] mt-1">Featured Fabrics</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm text-[#8b6f5e] hover:text-[#3d2b1f] transition-colors font-medium uppercase tracking-widest"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link to="/shop" className="text-sm text-[#8b6f5e] underline">View all products</Link>
          </div>
        </div>
      </section>

      <CategorySection />
      <PromoBanner />
      
    </div>
  );
};

export default HomePage;
