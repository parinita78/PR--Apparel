// ─── App.jsx – Root with Router + Providers ───────────────────────────────────
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";

// Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// Pages that should NOT show Navbar/Footer (full-screen layouts)
const BARE_ROUTES = ["/auth"];

const AppLayout = () => {
  const { pathname } = useLocation();
  const isBare = BARE_ROUTES.includes(pathname);

  return (
    <>
      <ScrollToTop />
      {!isBare && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#fdfaf6] pt-20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-8xl font-serif text-[#c9a882] mb-4">404</p>
                  <h2 className="text-2xl font-serif text-[#3d2b1f] mb-2">
                    Page Not Found
                  </h2>
                  <a href="/" className="text-sm text-[#8b6f5e] underline">
                    Return Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      {!isBare && <Footer />}
      {!isBare && <AIChatbot />}
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </AuthProvider>
  </Router>
);

export default App;
