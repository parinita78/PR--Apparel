// ─── User Profile Page ────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const ProfilePage = () => {
  const { currentUser: user, isLoggedIn, updateProfile, addAddress, removeAddress, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    navigate("/auth");
    return null;
  }
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Home", line1: "", city: "", state: "", pin: "" });
  const [saved, setSaved] = useState(false);

  const orders = user?.orders || [];
  const addresses = user?.addresses || [];

  const handleSave = () => {
    updateProfile(formData);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddAddress = () => {
    if (!newAddr.line1 || !newAddr.city) return;
    addAddress({ ...newAddr, default: false });
    setNewAddr({ label: "Home", line1: "", city: "", state: "", pin: "" });
    setShowAddAddress(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "addresses", label: "Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-20 lg:pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#c9a882] to-[#8b6f5e] rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
              {user.avatar}
            </div>
            <div>
              <h1 className="text-xl font-serif text-[#3d2b1f]">{user.name}</h1>
              <p className="text-sm text-[#8b6f5e]">{user.email}</p>
              <p className="text-xs text-[#a89880] mt-0.5">{user.phone}</p>
            </div>
            {saved && (
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
                ✓ Changes saved
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#ede8e0] p-3 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-[#3d2b1f] text-white"
                      : "text-[#5a4a3a] hover:bg-[#f5f0e8] hover:text-[#3d2b1f]"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-[#3d2b1f]">Personal Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-xs uppercase tracking-widest text-[#8b6f5e] border border-[#c9a882] px-4 py-2 rounded-full hover:bg-[#f0ebe3] transition-colors font-medium"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)} className="text-xs text-[#a89880] px-3 py-1.5">Cancel</button>
                      <button onClick={handleSave} className="text-xs uppercase tracking-widest text-white bg-[#3d2b1f] px-4 py-1.5 rounded-full font-medium hover:bg-[#8b6f5e] transition-colors">Save</button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Your name" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "you@email.com" },
                    { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs uppercase tracking-widest text-[#8b6f5e] mb-1.5 font-medium">
                        {field.label}
                      </label>
                      {editing ? (
                        <input
                          type={field.type}
                          value={formData[field.key]}
                          onChange={(e) => setFormData((f) => ({ ...f, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 text-sm bg-[#f5f0e8] border border-[#ddd5c8] rounded-xl text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c9a882]"
                        />
                      ) : (
                        <p className="text-sm text-[#3d2b1f] bg-[#fdfaf6] px-4 py-3 rounded-xl border border-[#ede8e0]">
                          {user[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#3d2b1f] mb-5">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-3xl mb-3">📦</p>
                    <p className="text-sm text-[#8b6f5e]">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-[#ede8e0] hover:bg-[#fdfaf6] transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-[#3d2b1f] font-mono">{order.id}</p>
                          <p className="text-xs text-[#a89880] mt-0.5">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-bold text-[#3d2b1f]">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Addresses Tab ── */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-[#3d2b1f]">Delivery Addresses</h2>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs uppercase tracking-widest text-white bg-[#3d2b1f] px-4 py-2 rounded-full hover:bg-[#8b6f5e] transition-colors font-medium"
                  >
                    + Add New
                  </button>
                </div>

                {/* Add address form */}
                {showAddAddress && (
                  <div className="mb-5 p-4 bg-[#fdfaf6] rounded-xl border border-[#ede8e0] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#8b6f5e] mb-1">Label</label>
                        <select
                          value={newAddr.label}
                          onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-[#ddd5c8] rounded-lg text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c9a882]"
                        >
                          {["Home", "Work", "Other"].map((l) => <option key={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#8b6f5e] mb-1">City</label>
                        <input value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))} placeholder="City" className="w-full px-3 py-2.5 text-sm bg-white border border-[#ddd5c8] rounded-lg text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c9a882]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#8b6f5e] mb-1">Street Address</label>
                      <input value={newAddr.line1} onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))} placeholder="House No, Street, Locality" className="w-full px-3 py-2.5 text-sm bg-white border border-[#ddd5c8] rounded-lg text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c9a882]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={newAddr.state} onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))} placeholder="State" className="w-full px-3 py-2.5 text-sm bg-white border border-[#ddd5c8] rounded-lg text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c9a882]" />
                      <input value={newAddr.pin} onChange={(e) => setNewAddr((a) => ({ ...a, pin: e.target.value }))} placeholder="PIN Code" className="w-full px-3 py-2.5 text-sm bg-white border border-[#ddd5c8] rounded-lg text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c9a882]" />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setShowAddAddress(false)} className="text-xs text-[#a89880] px-3 py-1.5">Cancel</button>
                      <button onClick={handleAddAddress} className="text-xs text-white bg-[#3d2b1f] px-4 py-1.5 rounded-full font-medium hover:bg-[#8b6f5e] transition-colors">Save Address</button>
                    </div>
                  </div>
                )}

                {/* Address list */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start justify-between p-4 rounded-xl border border-[#ede8e0] hover:bg-[#fdfaf6] transition-colors">
                      <div className="flex gap-3">
                        <svg className="w-4 h-4 text-[#c9a882] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold uppercase tracking-widest text-[#8b6f5e]">{addr.label}</span>
                            {addr.default && (
                              <span className="text-xs bg-[#f0ebe3] text-[#8b6f5e] px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-[#3d2b1f]">{addr.line1}</p>
                          <p className="text-xs text-[#8b6f5e]">{addr.city}, {addr.state} – {addr.pin}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="text-[#c9b8a8] hover:text-rose-400 transition-colors shrink-0 ml-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
