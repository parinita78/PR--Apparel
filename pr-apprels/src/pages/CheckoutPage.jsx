// ─── Checkout / Payment Page ──────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { id: "upi", label: "UPI Payment", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { id: "cod", label: "Cash on Delivery", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
];

const inputClass = "w-full px-4 py-3 text-sm bg-[#f5f0e8] border border-[#ddd5c8] rounded-xl text-[#3d2b1f] placeholder-[#a89880] focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:border-transparent transition-all";
const labelClass = "block text-xs uppercase tracking-widest text-[#8b6f5e] mb-1.5 font-medium";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", state: "", pin: "",
    cardNumber: "", expiry: "", cvv: "", cardName: "",
    upiId: "",
  });

  const shipping = cartTotal > 1999 ? 0 : 99;
  const total = cartTotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
      setForm((f) => ({ ...f, cardNumber: formatted }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "city" && value.length >= 3) fetchPincode(value);
  };

  const fetchPincode = async (city) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const po = data[0].PostOffice[0];
        setForm((f) => ({ ...f, pin: po.Pincode, state: po.State }));
      }
    } catch {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
    setTimeout(() => navigate("/profile"), 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif text-[#3d2b1f] mb-2">Order Placed!</h2>
          <p className="text-sm text-[#8b6f5e] mb-4">Thank you for your purchase. Your fabrics are on their way! 🎉</p>
          <p className="text-xs text-[#a89880] mb-6">Redirecting to your profile…</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest font-bold rounded-full hover:bg-[#8b6f5e] transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-20 lg:pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif text-[#3d2b1f] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Left: Forms ── */}
            <div className="lg:col-span-3 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#3d2b1f] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#c9a882] text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Priya Sharma" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} required placeholder="House No., Street, Locality" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input name="city" value={form.city} onChange={handleChange} required placeholder="Amritsar" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input name="state" value={form.state} onChange={handleChange} required placeholder="Punjab" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>PIN Code *</label>
                    <input name="pin" value={form.pin} onChange={handleChange} required placeholder="143001" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#3d2b1f] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#c9a882] text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
                  Payment Method
                </h2>

                {/* Method selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-xs uppercase tracking-wider font-medium transition-all duration-200 ${
                        paymentMethod === pm.id
                          ? "border-[#c9a882] bg-[#fdf7f0] text-[#8b6f5e]"
                          : "border-[#ede8e0] text-[#a89880] hover:border-[#c9a882]"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={pm.icon} />
                      </svg>
                      {pm.label}
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Card Number *</label>
                      <input name="cardNumber" value={form.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Expiry *</label>
                        <input name="expiry" value={form.expiry} onChange={handleChange} required placeholder="MM/YY" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>CVV *</label>
                        <input name="cvv" value={form.cvv} onChange={handleChange} required placeholder="•••" maxLength={4} type="password" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Name on Card *</label>
                      <input name="cardName" value={form.cardName} onChange={handleChange} required placeholder="Priya Sharma" className={inputClass} />
                    </div>
                  </div>
                )}

                {/* UPI field */}
                {paymentMethod === "upi" && (
                  <div>
                    <label className={labelClass}>UPI ID *</label>
                    <input name="upiId" value={form.upiId} onChange={handleChange} required placeholder="yourname@upi" className={inputClass} />
                  </div>
                )}

                {/* COD note */}
                {paymentMethod === "cod" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs mt-1 text-amber-600">Pay in cash when your order is delivered. Please keep exact change ready.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm sticky top-28">
                <h2 className="text-base font-semibold text-[#3d2b1f] uppercase tracking-widest mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-[#f5f0e8]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#3d2b1f] truncate">{item.name}</p>
                        <p className="text-xs text-[#a89880]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-[#3d2b1f]">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#ede8e0] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#5a4a3a]">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#5a4a3a]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-500 font-medium" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#3d2b1f] text-base border-t border-[#ede8e0] pt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-4 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest font-bold rounded-full hover:bg-[#8b6f5e] hover:scale-[1.02] transition-all duration-300"
                >
                  Place Order · ₹{total.toLocaleString()}
                </button>

                <p className="mt-3 text-center text-xs text-[#a89880]">
                  🔒 Your payment info is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
