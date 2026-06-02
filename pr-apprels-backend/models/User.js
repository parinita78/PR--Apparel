// ─── User Model ───────────────────────────────────────────────────────────────
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin: { type: String, required: true },
  default: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No duplicate emails
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },
    avatar: {
      type: String,
      default: function () {
        return this.name ? this.name.slice(0, 2).toUpperCase() : "U";
      },
    },
    addresses: [addressSchema],
    orders: [
      {
        orderId: String,
        date: String,
        status: String,
        items: Number,
        total: Number,
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt automatically
);

// ── Hash password BEFORE saving to database ───────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if password was modified (avoid re-hashing on profile update)
  if (!this.isModified("password")) return next();

  // bcrypt salt rounds = 12 (higher = more secure but slower)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method: Compare entered password with hashed password in DB ───────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
