# PR Apprels — Express.js Backend

Complete REST API backend for the PR Apprels clothing store frontend.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd pr-apprels-backend
npm install
```

### 2. Setup environment variables
```bash
# Copy the example file
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux

# Open .env and fill in your values
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Start the server
```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 📁 Folder Structure

```
pr-apprels-backend/
├── server.js                   ← Entry point
├── .env.example                ← Environment variables template
├── .gitignore
├── package.json
│
├── config/
│   └── data.js                 ← Product data (all 52 suits)
│
├── controllers/
│   ├── productController.js    ← Product logic
│   ├── cartController.js       ← Cart logic
│   ├── orderController.js      ← Order logic
│   └── chatController.js       ← AI chatbot logic (Claude API)
│
├── routes/
│   ├── productRoutes.js        ← Product endpoints
│   ├── cartRoutes.js           ← Cart endpoints
│   └── otherRoutes.js          ← Order + Chat endpoints
│
└── middleware/
    └── errorMiddleware.js      ← 404 + global error handler
```

---

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports filters) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/products/materials` | Get all materials |
| GET | `/api/products/occasions` | Get all occasions |
| GET | `/api/products/:id` | Get single product + related |

#### Query Parameters for `/api/products`
```
?search=silk          → Search by name/material/description
?category=unstitched  → Filter by category
?material=Cotton,Silk → Filter by material (comma-separated)
?occasion=Wedding     → Filter by occasion
?minPrice=1000        → Minimum price
?maxPrice=3000        → Maximum price
?sort=price-asc       → Sort (price-asc, price-desc, rating, reviews)
?inStock=true         → Only in-stock products
```

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/:sessionId` | Get cart |
| POST | `/api/cart/:sessionId/add` | Add item |
| PUT | `/api/cart/:sessionId/update` | Update quantity |
| DELETE | `/api/cart/:sessionId/remove/:productId` | Remove item |
| DELETE | `/api/cart/:sessionId/clear` | Clear cart |

#### Add to Cart Body
```json
{ "productId": 1, "quantity": 2 }
```

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:orderId` | Get order by ID |

#### Place Order Body
```json
{
  "cart": [...],
  "shippingAddress": {
    "name": "Priya Sharma",
    "email": "priya@email.com",
    "phone": "+91 98765 43210",
    "address": "12, Rose Garden Lane",
    "city": "Amritsar",
    "state": "Punjab",
    "pin": "143001"
  },
  "paymentMethod": "card",
  "userInfo": {}
}
```

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to Priya AI |

#### Chat Body
```json
{
  "messages": [
    { "role": "user", "content": "Show me bridal suits under ₹5000" }
  ]
}
```

---

## 🔗 Connecting to React Frontend

Update your `AIChatbot.jsx` fetch call to point to the backend:

```js
// Instead of calling Anthropic directly:
const response = await fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: apiMessages }),
});
const data = await response.json();
const { message, products } = data.data;
```

No API key needed in the frontend anymore! ✅

---

## 🔒 Security Features
- **Helmet** — Secure HTTP headers
- **CORS** — Only allows requests from your React frontend
- **Rate Limiting** — 200 requests/15min general, 30 requests/15min for chat
- **API Key hidden** — Stored in `.env`, never sent to browser
