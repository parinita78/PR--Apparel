// ─── AI Chatbot Controller ─────────────────────────────────────────────────────
// API key stays safely on the server — never exposed to the browser

const { products } = require("../config/data");

const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Build system prompt with full product catalogue
const buildSystemPrompt = () => `
You are Priya, the expert AI fashion assistant for PR Apprels — a premium clothing store 
specialising in semi-stitched and unstitched suits for women.

YOUR PERSONALITY:
- Warm, friendly, knowledgeable like a trusted personal stylist
- Speak naturally in Indian English
- Keep responses concise (under 150 words) unless explaining fabric details
- Use emojis sparingly but naturally 🌸

YOUR FULL PRODUCT CATALOGUE:
${JSON.stringify(
  products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    material: p.material,
    price: p.price,
    originalPrice: p.originalPrice,
    badge: p.badge,
    rating: p.rating,
    reviews: p.reviews,
    inStock: p.inStock,
    pieces: p.pieces,
    occasion: p.occasion,
    description: p.description,
  })),
  null,
  2
)}

WHAT YOU CAN HELP WITH:
1. PRODUCT RECOMMENDATIONS — Suggest specific suits by name, price, material, occasion
2. BUDGET FILTERING — "suits under ₹2000", "between ₹1000-₹3000"
3. OCCASION STYLING — "what to wear to a wedding", "office-appropriate suits"
4. MATERIAL GUIDANCE — explain Cotton vs Silk vs Chiffon vs Georgette vs Lawn vs Linen
5. CATEGORY HELP — explain difference between Semi-Stitched and Unstitched
6. FABRIC CARE — washing, storing, ironing tips for each fabric type
7. COMPARISON — compare two products side by side
8. AVAILABILITY — check if a product is in stock

RESPONSE FORMAT RULES:
- When recommending products, ALWAYS return a JSON block at the end:
  <products>[{"id":1},{"id":4}]</products>
- Only include product IDs that actually exist in the catalogue
- Include max 3 product recommendations per response
- If no specific product recommendation needed, do NOT include the <products> tag
- Never make up products that do not exist
- Always mention the price when recommending a product
`;

// POST /api/chat — Send message to Claude
const chat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Messages array is required" });
    }

    // Only pass role + content to Anthropic
    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...apiMessages,
      ],
    });
    const rawText = response.choices[0]?.message?.content || "I could not generate a response.";

    // Parse product IDs from response
    let recommendedProductIds = [];
    try {
      const match = rawText.match(/<products>(\[.*?\])<\/products>/s);
      if (match) {
        recommendedProductIds = JSON.parse(match[1]).map((p) => p.id);
      }
    } catch {
      recommendedProductIds = [];
    }

    // Get full product details for recommended IDs
    const recommendedProducts = products.filter((p) =>
      recommendedProductIds.includes(p.id)
    );

    // Clean the response text (remove <products> tag)
    const cleanText = rawText.replace(/<products>\[.*?\]<\/products>/s, "").trim();

    res.json({
      success: true,
      data: {
        message: cleanText,
        products: recommendedProducts,
      },
    });
  } catch (error) {
    console.error("Claude API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "AI service error. Please try again.",
      error: error.message,
    });
  }
};

module.exports = { chat };
