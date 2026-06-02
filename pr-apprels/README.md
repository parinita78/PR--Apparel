# PR Apprels — Premium Clothing Store Frontend

A complete, production-ready React frontend for a clothing e-commerce store specialising in semi-stitched and unstitched fabrics.

---

## 🛍️ Features

| Feature | Details |
|---|---|
| **Navbar** | Responsive, sticky, with search, cart count badge, animated hamburger |
| **Home Page** | Hero banner, featured products, category cards, promo banner, testimonials, footer |
| **Shop Page** | Product grid + sidebar filters (category, material, price range, sort) |
| **Product Detail** | Large image, description, quantity selector, related products |
| **Cart Page** | Quantity controls, remove items, order summary, free shipping threshold |
| **Checkout** | Multi-step form: address + payment (Card / UPI / COD), order success screen |
| **Profile** | Tabbed: personal info (editable), order history, address management |
| **Categories** | Visual category + material browser |
| **AI Chatbot** | Floating Priya assistant powered by Claude claude-sonnet, bottom-right corner |
| **Responsive** | Mobile-first, works on all screen sizes |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# 1. Navigate into the project folder
cd pr-apprels

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000**

---

## 📁 Project Structure

```
pr-apprels/
├── public/
│   ├── index.html          # HTML shell with Google Fonts
│   └── manifest.json       # PWA manifest
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Responsive navbar with search + cart badge
│   │   ├── Footer.jsx      # Footer with links, contact, social
│   │   ├── ProductCard.jsx # Reusable product card with Add to Cart
│   │   └── AIChatbot.jsx   # Floating AI assistant (Claude-powered)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        # Hero + featured + categories + promo
│   │   ├── ShopPage.jsx        # Product listing with filters
│   │   ├── CategoriesPage.jsx  # Category + material browser
│   │   ├── ProductDetailPage.jsx # Single product detail view
│   │   ├── CartPage.jsx        # Shopping cart with summary
│   │   ├── CheckoutPage.jsx    # Address + payment checkout
│   │   └── ProfilePage.jsx     # User profile, orders, addresses
│   │
│   ├── context/
│   │   ├── CartContext.jsx  # Global cart state (useReducer + localStorage)
│   │   └── UserContext.jsx  # Global user state (useState + localStorage)
│   │
│   ├── data/
│   │   └── products.js      # 8 dummy products + categories + testimonials
│   │
│   ├── App.jsx              # Router setup + layout shell
│   ├── index.js             # React DOM entry point
│   └── index.css            # Tailwind directives + custom base styles
│
├── tailwind.config.js       # Tailwind theme extensions (brand colors, fonts)
├── postcss.config.js        # PostCSS with Tailwind + Autoprefixer
└── package.json             # Dependencies and scripts
```

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `brand-50` | `#fdfaf6` | Page backgrounds |
| `brand-100` | `#f5f0e8` | Card backgrounds |
| `brand-400` | `#c9a882` | Accents, badges, highlights |
| `brand-600` | `#8b6f5e` | Secondary text, hover states |
| `brand-800` | `#3d2b1f` | Primary text, buttons, navbar |

### Typography
- **Display/Headings**: Playfair Display (serif, elegant)
- **Body/UI**: Jost (clean, modern sans-serif)

---

## 🤖 AI Chatbot Setup

The AI assistant (Priya) uses the **Anthropic Claude API** directly from the browser.

The API call is made inside `src/components/AIChatbot.jsx`. The app is designed to run behind a proxy or via Claude.ai's artifact environment where the API key is handled automatically.

If running standalone, add an API key header to the fetch call in `AIChatbot.jsx`:
```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": "YOUR_ANTHROPIC_API_KEY",
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
}
```

---

## 🛒 State Management

### Cart (CartContext)
- Powered by `useReducer`
- Actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`
- Persisted to `localStorage` automatically
- `cartCount` and `cartTotal` derived values exposed via context

### User (UserContext)
- Powered by `useState`
- Includes profile, addresses, and order history
- Persisted to `localStorage`

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `/build` folder — ready for deployment on Vercel, Netlify, or any static host.

---

## 🔧 Customisation Tips

- **Add products**: Edit `src/data/products.js` — just add objects following the same schema
- **Change brand colours**: Update `tailwind.config.js` → `theme.extend.colors.brand`
- **Add pages**: Create in `src/pages/`, import in `App.jsx`, add a `<Route>`
- **Chatbot persona**: Edit the `SYSTEM_PROMPT` in `AIChatbot.jsx`

---

*Built with React 18 · React Router 6 · Tailwind CSS 3 · Context API*
