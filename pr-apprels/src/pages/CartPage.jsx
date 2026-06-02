// ─── Cart Page ────────────────────────────────────────────────────────────────
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal > 1999 ? 0 : 99;
  const total = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] pt-20 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="text-7xl mb-6">🛍️</div>
          <h2 className="text-2xl font-serif text-[#3d2b1f] mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#8b6f5e] mb-8">Looks like you haven't added any fabrics yet. Let's change that!</p>
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest font-semibold rounded-full hover:bg-[#8b6f5e] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-[#3d2b1f]">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-xs text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-[#ede8e0] shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="text-sm font-semibold text-[#3d2b1f] hover:text-[#8b6f5e] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#8b6f5e] mt-0.5 capitalize">{item.material} · {item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#c9b8a8] hover:text-rose-400 transition-colors shrink-0 ml-2"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#ddd5c8] rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#5a4a3a] hover:bg-[#f0ebe3] transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#3d2b1f]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#5a4a3a] hover:bg-[#f0ebe3] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#3d2b1f]">₹{(item.price * item.quantity).toLocaleString()}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-[#a89880]">₹{item.price.toLocaleString()} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link
              to="/shop"
              className="flex items-center gap-2 text-sm text-[#8b6f5e] hover:text-[#3d2b1f] transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm sticky top-28">
              <h2 className="text-base font-semibold text-[#3d2b1f] uppercase tracking-widest mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#5a4a3a]">
                  <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#5a4a3a]">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-medium">Free</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#8b6f5e] bg-[#f5f0e8] rounded-lg px-3 py-2">
                    Add ₹{(1999 - cartTotal).toLocaleString()} more for free shipping!
                  </p>
                )}
                <div className="border-t border-[#ede8e0] pt-3 flex justify-between font-bold text-[#3d2b1f] text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full py-4 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest font-bold rounded-full hover:bg-[#8b6f5e] hover:scale-[1.02] transition-all duration-300"
              >
                Proceed to Checkout
              </button>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#a89880]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout · SSL Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
