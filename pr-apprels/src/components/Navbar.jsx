// ─── Navbar Component ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#user-menu")) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/categories", label: "Categories" },
    { to: "/cart", label: "Cart" },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#fdfaf6] transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* ── Brand Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-2xl lg:text-3xl font-serif tracking-widest text-[#8b6f5e] group-hover:text-[#c9a882] transition-colors duration-300">
              PR
            </span>
            <span className="text-base lg:text-lg font-light tracking-[0.2em] text-[#3d2b1f] uppercase">
              Apprels
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm tracking-widest uppercase font-medium transition-colors duration-200 pb-1 group ${
                  isActive(link.to)
                    ? "text-[#8b6f5e]"
                    : "text-[#5a4a3a] hover:text-[#8b6f5e]"
                }`}
              >
                {link.label}
                {link.to === "/cart" && cartCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-[#c9a882] text-white rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#c9a882] transition-all duration-300 ${
                    isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* ── Desktop Right: Search + User ── */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fabrics…"
                  className="w-48 xl:w-56 pl-4 pr-10 py-2 text-sm bg-[#f0ebe3] border border-[#ddd5c8] rounded-full text-[#3d2b1f] placeholder-[#a89880] focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f5e] hover:text-[#c9a882] transition-colors"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* User Menu / Login Button */}
            {isLoggedIn ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 bg-[#c9a882] rounded-full flex items-center justify-center text-white text-xs font-bold group-hover:bg-[#8b6f5e] transition-colors">
                    {currentUser?.avatar || "U"}
                  </div>
                  <span className="text-sm text-[#5a4a3a] font-medium max-w-[80px] truncate">
                    {currentUser?.name?.split(" ")[0]}
                  </span>
                  <svg
                    className={`w-3 h-3 text-[#8b6f5e] transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl border border-[#ede8e0] shadow-xl overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#5a4a3a] hover:bg-[#f5f0e8] hover:text-[#3d2b1f] transition-colors"
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
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Profile
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#5a4a3a] hover:bg-[#f5f0e8] hover:text-[#3d2b1f] transition-colors"
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
                          strokeWidth={1.5}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Cart
                      {cartCount > 0 && (
                        <span className="ml-auto w-5 h-5 bg-[#c9a882] text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-[#ede8e0]" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:bg-rose-50 transition-colors"
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
                          strokeWidth={1.5}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2 bg-[#3d2b1f] text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-[#8b6f5e] hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile: Cart + Hamburger ── */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/cart" className="relative p-2">
              <svg
                className="w-6 h-6 text-[#5a4a3a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs bg-[#c9a882] text-white rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#5a4a3a] hover:text-[#8b6f5e] transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`lg:hidden bg-[#fdfaf6] border-t border-[#ede8e0] overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-screen pb-4" : "max-h-0"}`}
      >
        {/* Mobile search */}
        <form onSubmit={handleSearch} className="px-4 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabrics…"
              className="w-full pl-4 pr-10 py-2.5 text-sm bg-[#f0ebe3] border border-[#ddd5c8] rounded-full text-[#3d2b1f] placeholder-[#a89880] focus:outline-none focus:ring-2 focus:ring-[#c9a882]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f5e]"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Mobile nav links */}
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 text-sm uppercase tracking-widest font-medium transition-colors ${
              isActive(link.to)
                ? "text-[#8b6f5e] bg-[#f5f0e8]"
                : "text-[#5a4a3a] hover:bg-[#f5f0e8] hover:text-[#8b6f5e]"
            }`}
          >
            {link.label}
            {link.to === "/cart" && cartCount > 0 && (
              <span className="w-5 h-5 text-xs bg-[#c9a882] text-white rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        ))}

        {/* Mobile: Profile or Login */}
        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm uppercase tracking-widest font-medium text-[#5a4a3a] hover:bg-[#f5f0e8]"
            >
              Profile ({currentUser?.name?.split(" ")[0]})
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm uppercase tracking-widest font-medium text-rose-400 hover:bg-rose-50 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-3 text-sm uppercase tracking-widest font-medium text-[#8b6f5e] hover:bg-[#f5f0e8] hover:text-[#3d2b1f]"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
