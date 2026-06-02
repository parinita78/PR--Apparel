// ─── Auth Utilities ───────────────────────────────────────────────────────────
// Uses the built-in Web Crypto API (no extra package needed in the browser)
// SHA-256 hashing for password storage

// Hash a plain-text password → returns hex string
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

// Compare a plain-text password against a stored hash
export const verifyPassword = async (password, storedHash) => {
  const hash = await hashPassword(password);
  return hash === storedHash;
};

// Basic email format validator
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Password strength checker
// Returns: { strong: boolean, message: string }
export const checkPasswordStrength = (password) => {
  if (password.length < 6)
    return { strong: false, message: "At least 6 characters required" };
  if (password.length < 8)
    return {
      strong: false,
      message: "Use 8+ characters for a stronger password",
    };
  if (!/[A-Z]/.test(password))
    return { strong: false, message: "Add at least one uppercase letter" };
  if (!/[0-9]/.test(password))
    return { strong: false, message: "Add at least one number" };
  return { strong: true, message: "Strong password ✓" };
};
