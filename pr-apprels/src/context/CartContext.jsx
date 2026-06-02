// ─── Cart Context ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// Reducer handles all cart mutations
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
    try {
      const saved = localStorage.getItem("pr_cart");
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("pr_cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (product, quantity = 1) =>
    dispatch({ type: "ADD_ITEM", payload: { ...product, quantity } });

  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart: state.items, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
