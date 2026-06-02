// ─── Login / Signup Page ──────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, checkPasswordStrength } from "../utils/authUtils";

// ── Password Strength Bar ─────────────────────────────────────────────────────
const StrengthBar = ({ password }) => {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const colors = [
    "bg-rose-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-emerald-400",
  ];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-1.5">
      {/* Bars */}
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : "bg-[#ede8e0]"
            }`}
          />
        ))}
      </div>
      {/* Label */}
      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-medium ${
            score === 0
              ? "text-[#a89880]"
              : score === 1
                ? "text-rose-400"
                : score === 2
                  ? "text-orange-400"
                  : score === 3
                    ? "text-amber-500"
                    : "text-emerald-500"
          }`}
        >
          {score === 0 ? "Enter a password" : labels[score - 1]}
        </p>
        {/* Mini checklist */}
        <div className="flex gap-2">
          {[
            { key: "length", label: "8+" },
            { key: "uppercase", label: "A-Z" },
            { key: "number", label: "0-9" },
          ].map((c) => (
            <span
              key={c.key}
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                checks[c.key]
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-[#f0ebe3] text-[#a89880]"
              }`}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Input Field Component ────────────────────────────────────────────────────
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon,
  rightElement,
}) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-[#8b6f5e] mb-1.5 font-medium">
      {label}
    </label>
    <div className="relative">
      {/* Left icon */}
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89880]">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? "pl-10" : "pl-4"} ${rightElement ? "pr-12" : "pr-4"} py-3 text-sm bg-[#f5f0e8] border rounded-xl text-[#3d2b1f] placeholder-[#a89880] focus:outline-none focus:ring-2 focus:ring-[#c9a882] focus:border-transparent transition-all duration-200 ${
          error ? "border-rose-300 bg-rose-50" : "border-[#ddd5c8]"
        }`}
      />
      {/* Right element (e.g. show/hide password) */}
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
  </div>
);

// ── Eye Icon ──────────────────────────────────────────────────────────────────
const EyeIcon = ({ show, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-[#a89880] hover:text-[#8b6f5e] transition-colors"
  >
    {show ? (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    )}
  </button>
);

// ─── Main AuthPage Component ──────────────────────────────────────────────────
const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isLoggedIn } = useAuth();

  // Determine initial tab from URL query ?mode=signup
  const initialMode =
    new URLSearchParams(location.search).get("mode") === "signup"
      ? "signup"
      : "login";

  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Login form state ──────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // ── Signup form state ─────────────────────────────────────────────────────
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  // Clear messages on tab switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setServerMessage({ type: "", text: "" });
    setLoginErrors({});
    setSignupErrors({});
  };

  // ── Login Validation ──────────────────────────────────────────────────────
  const validateLogin = () => {
    const errors = {};
    if (!loginForm.email) errors.email = "Email is required";
    else if (!isValidEmail(loginForm.email))
      errors.email = "Enter a valid email";
    if (!loginForm.password) errors.password = "Password is required";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Signup Validation ─────────────────────────────────────────────────────
  const validateSignup = () => {
    const errors = {};
    if (!signupForm.name.trim()) errors.name = "Full name is required";
    if (!signupForm.email) errors.email = "Email is required";
    else if (!isValidEmail(signupForm.email))
      errors.email = "Enter a valid email";
    if (!signupForm.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[0-9+\s-]{10,}$/.test(signupForm.phone))
      errors.phone = "Enter a valid phone number";
    const strength = checkPasswordStrength(signupForm.password);
    if (!signupForm.password) errors.password = "Password is required";
    else if (!strength.strong) errors.password = strength.message;
    if (!signupForm.confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (signupForm.password !== signupForm.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handle Login Submit ───────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    setServerMessage({ type: "", text: "" });

    const result = await login({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (result.success) {
      setServerMessage({ type: "success", text: result.message });
      setTimeout(() => navigate(location.state?.from || "/"), 800);
    } else {
      setServerMessage({ type: "error", text: result.message });
    }
    setLoading(false);
  };

  // ── Handle Signup Submit ──────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    setServerMessage({ type: "", text: "" });

    const result = await signup({
      name: signupForm.name.trim(),
      email: signupForm.email,
      phone: signupForm.phone.trim(),
      password: signupForm.password,
    });

    if (result.success) {
      setServerMessage({ type: "success", text: result.message });
      setTimeout(() => navigate("/"), 800);
    } else {
      setServerMessage({ type: "error", text: result.message });
    }
    setLoading(false);
  };

  // ── Shared icon SVGs ──────────────────────────────────────────────────────
  const icons = {
    email: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    lock: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    user: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    phone: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ── Left Panel — Branding ── */}
        <div className="hidden lg:flex flex-col justify-between bg-[#3d2b1f] p-10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a882]/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a882]/10 rounded-full translate-y-24 -translate-x-24" />

          {/* Logo */}
          <div>
            <Link to="/" className="flex items-baseline gap-2">
              <span className="text-4xl font-serif text-[#c9a882] tracking-widest">
                PR
              </span>
              <span className="text-sm font-light tracking-[0.2em] text-white uppercase">
                Apprels
              </span>
            </Link>
            <p className="text-[#a89880] text-sm mt-3 leading-relaxed">
              Premium semi-stitched &amp; unstitched suits for the modern woman.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-5 relative z-10">
            {[
              {
                icon: "🛍️",
                title: "52+ Premium Suits",
                desc: "Curated collection across all fabrics",
              },
              {
                icon: "✂️",
                title: "Custom Fitting",
                desc: "Semi-stitched to your measurements",
              },
              {
                icon: "🚚",
                title: "Free Delivery",
                desc: "On orders above ₹1,999",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                desc: "7-day hassle-free return policy",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-[#a89880] text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom quote */}
          <p className="text-[#6b5a4e] text-xs italic relative z-10">
            "Every thread tells a story of craftsmanship and elegance."
          </p>
        </div>

        {/* ── Right Panel — Form ── */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-serif text-[#c9a882] tracking-widest">
              PR
            </span>
            <span className="text-xs font-light tracking-[0.2em] text-[#3d2b1f] uppercase">
              Apprels
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-[#f5f0e8] rounded-xl p-1 mb-7">
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                onClick={() => switchMode(tab)}
                className={`flex-1 py-2.5 text-sm font-semibold uppercase tracking-widest rounded-lg transition-all duration-300 ${
                  mode === tab
                    ? "bg-[#3d2b1f] text-white shadow-md"
                    : "text-[#8b6f5e] hover:text-[#3d2b1f]"
                }`}
              >
                {tab === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Server message */}
          {serverMessage.text && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
                serverMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-600 border border-rose-200"
              }`}
            >
              {serverMessage.type === "success" ? "✓ " : "⚠ "}
              {serverMessage.text}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <h2 className="text-2xl font-serif text-[#3d2b1f]">
                  Welcome back
                </h2>
                <p className="text-sm text-[#8b6f5e] mt-1">
                  Sign in to your PR Apprels account
                </p>
              </div>

              <InputField
                label="Email Address"
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder="you@email.com"
                error={loginErrors.email}
                icon={icons.email}
              />

              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Enter your password"
                error={loginErrors.password}
                icon={icons.lock}
                rightElement={
                  <EyeIcon
                    show={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                }
              />

              {/* Forgot password placeholder */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-[#8b6f5e] hover:text-[#3d2b1f] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#8b6f5e] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <p className="text-center text-sm text-[#8b6f5e]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-[#3d2b1f] font-semibold hover:text-[#c9a882] transition-colors"
                >
                  Sign up free
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4" noValidate>
              <div>
                <h2 className="text-2xl font-serif text-[#3d2b1f]">
                  Create account
                </h2>
                <p className="text-sm text-[#8b6f5e] mt-1">
                  Join PR Apprels and explore 52+ suits
                </p>
              </div>

              <InputField
                label="Full Name"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, name: e.target.value })
                }
                placeholder="Priya Sharma"
                error={signupErrors.name}
                icon={icons.user}
              />

              <InputField
                label="Email Address"
                type="email"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
                placeholder="you@email.com"
                error={signupErrors.email}
                icon={icons.email}
              />

              <InputField
                label="Phone Number"
                type="tel"
                value={signupForm.phone}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                error={signupErrors.phone}
                icon={icons.phone}
              />

              <div>
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  placeholder="Min 8 characters"
                  error={signupErrors.password}
                  icon={icons.lock}
                  rightElement={
                    <EyeIcon
                      show={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {/* Password strength bar */}
                <StrengthBar password={signupForm.password} />
              </div>

              <InputField
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={signupForm.confirmPassword}
                onChange={(e) =>
                  setSignupForm({
                    ...signupForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Re-enter your password"
                error={signupErrors.confirmPassword}
                icon={icons.lock}
                rightElement={
                  <EyeIcon
                    show={showConfirm}
                    onClick={() => setShowConfirm(!showConfirm)}
                  />
                }
              />

              {/* Terms */}
              <p className="text-xs text-[#a89880]">
                By creating an account you agree to our{" "}
                <span className="text-[#8b6f5e] cursor-pointer hover:underline">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-[#8b6f5e] cursor-pointer hover:underline">
                  Privacy Policy
                </span>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#3d2b1f] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#8b6f5e] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-sm text-[#8b6f5e]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-[#3d2b1f] font-semibold hover:text-[#c9a882] transition-colors"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#a89880]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Your password is encrypted and never stored in plain text
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
