// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Jost'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdfaf6",
          100: "#f5f0e8",
          200: "#ede8e0",
          300: "#ddd5c8",
          400: "#c9a882",
          500: "#a89880",
          600: "#8b6f5e",
          700: "#5a4a3a",
          800: "#3d2b1f",
          900: "#2a1d14",
        },
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
      },
      backgroundImage: {
        "fabric-pattern":
          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(201,168,130,0.05) 10px, rgba(201,168,130,0.05) 20px)",
      },
    },
  },
  plugins: [],
};
