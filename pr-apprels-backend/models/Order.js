// ─── Order Model ──────────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  image:     { type: String },
  material:  { type: String },
  category:  { type: String },
});

const shippingAddressSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, required: true },
  address: { type: String, required: true },
  city:    { type: String, required: true },
  state:   { type: String, required: true },
  pin:     { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => `PRO-${Date.now().toString().slice(-6)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Optional — guest checkout allowed
    },
    items:           [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod"],
      required: true,
    },
    subtotal:  { type: Number, required: true },
    shipping:  { type: Number, default: 0 },
    total:     { type: Number, required: true },
    status: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
