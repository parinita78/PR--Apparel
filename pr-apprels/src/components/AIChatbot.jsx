// ─── AI Chatbot — Full Product Aware Agent ────────────────────────────────────
// Priya — PR Apprels Smart Shopping Assistant
// Features:
//   • Full 52-product catalogue awareness
//   • Intent detection (budget / occasion / material / category)
//   • Product cards rendered inside chat
//   • Quick reply suggestion buttons
//   • Conversation memory (multi-turn)

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

// ─── System Prompt ─────────────────────────────────────────────────────────────
// We pass the full product catalogue so Claude has complete awareness
const buildSystemPrompt = () => `
You are Priya, the expert AI fashion assistant for PR Apprels — a premium clothing store 
specialising in semi-stitched and unstitched suits for women.

YOUR PERSONALITY:
- Warm, friendly, knowledgeable like a trusted personal stylist
- Speak naturally in Indian English
- Keep responses concise (under 150 words) unless explaining fabric details
- Use emojis sparingly but naturally 🌸

YOUR FULL PRODUCT CATALOGUE (52 suits):
${JSON.stringify(
  products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    material: p.material,
    price: p.price,
    originalPrice: p.originalPrice,
    badge: p.badge,
    rating: p.rating,
    reviews: p.reviews,
    inStock: p.inStock,
    pieces: p.pieces,
    occasion: p.occasion,
    description: p.description,
  })),
  null,
  2
)}

WHAT YOU CAN HELP WITH:
1. PRODUCT RECOMMENDATIONS — Suggest specific suits by name, price, material, occasion
2. BUDGET FILTERING — "suits under ₹2000", "best suits between ₹1000-₹3000"
3. OCCASION STYLING — "what to wear to a wedding", "office-appropriate suits"
4. MATERIAL GUIDANCE — explain Cotton vs Silk vs Chiffon vs Georgette vs Lawn vs Linen
5. CATEGORY HELP — explain difference between Semi-Stitched and Unstitched
6. FABRIC CARE — washing, storing, ironing tips for each fabric type
7. COMPARISON — compare two products side by side
8. AVAILABILITY — check if a product is in stock
9. ORDER STATUS — tell them to visit the Profile page to check orders

RESPONSE FORMAT RULES:
- When recommending products, ALWAYS return a special JSON block at the end of your message
- Format it EXACTLY like this (do not change the tags):
  <products>[{"id":1},{"id":4}]</products>
- Only include product IDs that actually exist in the catalogue above
- Include max 3 product recommendations per response
- If no specific product recommendation needed, do NOT include the <products> tag
- Never make up products that don't exist in the catalogue
- Always mention the price when recommending a product
- If a product is out of stock, mention it clearly and suggest alternatives

EXAMPLE RESPONSES:
User: "I need a suit for a wedding under ₹3000"
Priya: "For weddings under ₹3000, I'd suggest the Blush Pink Georgette Suit (₹2,799) with beautiful sequin work, or the Teal Green Silk Anarkali (₹3,499 — slightly over but worth it!). The Lavender Georgette Suit (₹2,399) is also a lovely choice with scalloped embroidery 🌸
<products>[{"id":18},{"id":22},{"id":13}]</products>"

User: "What's the difference between semi-stitched and unstitched?"
Priya: "Great question! 
• Unstitched: Raw fabric — you take it to your tailor and get it stitched completely from scratch to your exact measurements.
• Semi-stitched: Partially stitched — the front embroidery, neckline and basic structure are done. Your tailor only needs to finish the sides and hem. Saves time and tailoring cost!
Most customers prefer semi-stitched for embroidered suits since the delicate work is already done professionally."
`;

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-center gap-1 px-3 py-2.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-[#c9a882] animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

// ─── Mini Product Card (inside chat) ─────────────────────────────────────────
const ChatProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [added, setAdded] = useState(false);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex gap-2.5 bg-white rounded-xl border border-[#ede8e0] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-20 h-20 shrink-0 bg-[#f5f0e8] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 py-2 pr-2 min-w-0">
        <p className="text-xs font-semibold text-[#3d2b1f] leading-tight line-clamp-1">
          {product.name}
        </p>
        <p className="text-xs text-[#a89880] mt-0.5 capitalize">
          {product.material} · {product.category}
        </p>

        {/* Price row */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs font-bold text-[#3d2b1f]">
            ₹{product.price.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-xs text-rose-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs text-emerald-500 font-semibold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Stock + rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium ${product.inStock ? "text-emerald-500" : "text-rose-400"}`}>
            {product.inStock ? "● In Stock" : "● Out of Stock"}
          </span>
          <span className="text-xs text-amber-500">★ {product.rating}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
              !product.inStock
                ? "bg-[#f0ebe3] text-[#a89880] cursor-not-allowed"
                : added
                ? "bg-emerald-400 text-white"
                : "bg-[#3d2b1f] text-white hover:bg-[#8b6f5e]"
            }`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
          <button
            onClick={() => onViewDetails(product.id)}
            className="text-xs px-2.5 py-1 rounded-full border border-[#c9a882] text-[#8b6f5e] hover:bg-[#f0ebe3] transition-colors font-medium"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Parse product IDs from Claude's response ─────────────────────────────────
const parseProductsFromResponse = (text) => {
  try {
    const match = text.match(/<products>(\[.*?\])<\/products>/s);
    if (!match) return [];
    const ids = JSON.parse(match[1]).map((p) => p.id);
    return products.filter((p) => ids.includes(p.id));
  } catch {
    return [];
  }
};

// ─── Strip <products> tag from display text ───────────────────────────────────
const cleanMessageText = (text) =>
  text.replace(/<products>\[.*?\]<\/products>/s, "").trim();

// ─── Quick Reply Suggestions ──────────────────────────────────────────────────
const QUICK_REPLIES = [
  { label: "👰 Bridal suits", prompt: "Show me bridal suits" },
  { label: "💸 Under ₹1500", prompt: "Show suits under ₹1500" },
  { label: "🌸 Cotton suits", prompt: "What cotton suits do you have?" },
  { label: "✨ Silk suits", prompt: "Show me silk suits" },
  { label: "🎉 Party suits", prompt: "Suits for a party" },
  { label: "❓ Semi vs Unstitched", prompt: "What is the difference between semi-stitched and unstitched?" },
  { label: "⭐ Best sellers", prompt: "What are your bestselling suits?" },
];

// ─── Main Chatbot Component ───────────────────────────────────────────────────
const AIChatbot = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! 🌸 I'm Priya, your PR Apprels style assistant. I know all 52 suits in our collection!\n\nHow can I help you today? You can ask me about suits for any occasion, budget, or fabric.",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  // ── Send message to Claude ────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    // Hide quick replies after first message
    setShowQuickReplies(false);

    const userMsg = { role: "user", content: trimmed, products: [] };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Build API messages (only role + content, no products field)
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();
      const cleanText = data?.data?.message || "I'm sorry, I couldn't fetch a response. Please try again.";
      const recommendedProducts = data?.data?.products || [];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanText,
          products: recommendedProducts,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again in a moment.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
    setOpen(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! 🌸 How can I help you find the perfect suit today?",
        products: [],
      },
    ]);
    setShowQuickReplies(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#3d2b1f] hover:bg-[#8b6f5e] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Open AI assistant"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#c9a882] animate-ping opacity-30" />
        )}
      </button>

      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#fdfaf6] rounded-2xl shadow-2xl border border-[#ede8e0] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{ maxHeight: "580px" }}
      >
        {/* ── Header ── */}
        <div className="bg-[#3d2b1f] px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[#c9a882] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Priya — Style Assistant</p>
            <p className="text-[#c9b8a8] text-xs">Knows all 52 suits · Always available</p>
          </div>
          {/* Clear chat */}
          <button
            onClick={handleClearChat}
            title="Clear chat"
            className="text-[#c9b8a8] hover:text-white transition-colors ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>

        {/* ── Messages ── */}
        <div
          className="flex-1 overflow-y-auto p-3 space-y-3"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {/* Message bubble */}
              <div
                className={`max-w-[85%] text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#3d2b1f] text-white rounded-br-sm"
                    : "bg-white text-[#3d2b1f] rounded-bl-sm border border-[#ede8e0] shadow-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Product cards below assistant message */}
              {msg.role === "assistant" && msg.products?.length > 0 && (
                <div className="w-full mt-2 space-y-2">
                  {msg.products.map((product) => (
                    <ChatProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#ede8e0] rounded-2xl rounded-bl-sm shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Replies ── */}
        {showQuickReplies && (
          <div className="px-3 pb-2 shrink-0">
            <p className="text-xs text-[#a89880] mb-1.5 uppercase tracking-widest">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.prompt}
                  onClick={() => sendMessage(qr.prompt)}
                  className="text-xs px-2.5 py-1.5 bg-white text-[#8b6f5e] rounded-full hover:bg-[#c9a882] hover:text-white transition-colors border border-[#ddd5c8] font-medium"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input ── */}
        <div className="p-3 border-t border-[#ede8e0] bg-white flex gap-2 items-end shrink-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Priya about suits, fabrics, budget…"
            rows={1}
            className="flex-1 resize-none text-xs text-[#3d2b1f] bg-[#f5f0e8] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c9a882] placeholder-[#a89880] max-h-24"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 shrink-0 bg-[#3d2b1f] disabled:bg-[#ddd5c8] text-white rounded-xl flex items-center justify-center hover:bg-[#8b6f5e] transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
