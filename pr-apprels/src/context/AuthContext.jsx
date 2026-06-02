// ─── Auth Context (Backend Connected) ────────────────────────────────────────
// All auth now goes through Express backend → MongoDB
// JWT token stored in localStorage for session persistence

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";
const TOKEN_KEY = "pr_token";
const USER_KEY  = "pr_user";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser]   = useState(null);
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [authLoading, setAuthLoading]   = useState(true);

  // ── On mount: restore session from localStorage ───────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user  = localStorage.getItem(USER_KEY);

    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setAuthLoading(false);
  }, []);

  // ── Helper: get stored token ──────────────────────────────────────────────
  const getToken = () => localStorage.getItem(TOKEN_KEY);

  // ── SIGNUP ────────────────────────────────────────────────────────────────
  const signup = async ({ name, email, phone, password }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || "Signup failed" };
      }

      // Save token + user to localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsLoggedIn(true);

      return { success: true, message: "Account created successfully!" };
    } catch (error) {
      return { success: false, message: "Cannot connect to server. Make sure backend is running." };
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsLoggedIn(true);

      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      return { success: false, message: "Cannot connect to server. Make sure backend is running." };
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // ── UPDATE PROFILE ────────────────────────────────────────────────────────
  const updateProfile = async (updates) => {
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Update failed" };
    }
  };

  // ── ADD ADDRESS ───────────────────────────────────────────────────────────
  const addAddress = async (address) => {
    try {
      const response = await fetch(`${API_URL}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();
      if (data.success) {
        const updated = { ...currentUser, addresses: data.addresses };
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        setCurrentUser(updated);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Failed to add address" };
    }
  };

  // ── REMOVE ADDRESS ────────────────────────────────────────────────────────
  const removeAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_URL}/address/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await response.json();
      if (data.success) {
        const updated = { ...currentUser, addresses: data.addresses };
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        setCurrentUser(updated);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Failed to remove address" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        authLoading,
        getToken,
        signup,
        login,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
