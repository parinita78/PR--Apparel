// ─── User Context ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

const DEFAULT_USER = {
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "PS",
  addresses: [
    { id: 1, label: "Home", line1: "12, Rose Garden Lane", city: "Amritsar", state: "Punjab", pin: "143001", default: true },
  ],
  orders: [
    { id: "PRO-2024-001", date: "2024-11-15", status: "Delivered", items: 2, total: 3798 },
    { id: "PRO-2024-002", date: "2024-12-02", status: "Processing", items: 1, total: 2499 },
  ],
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("pr_user");
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    localStorage.setItem("pr_user", JSON.stringify(user));
  }, [user]);

  const updateProfile = (updates) => setUser((prev) => ({ ...prev, ...updates }));

  const addAddress = (address) =>
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { ...address, id: Date.now() }],
    }));

  const removeAddress = (id) =>
    setUser((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }));

  return (
    <UserContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, updateProfile, addAddress, removeAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
