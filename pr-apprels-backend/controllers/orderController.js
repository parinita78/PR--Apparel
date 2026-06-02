// ─── Order Controller (MongoDB) ───────────────────────────────────────────────
const Order = require("../models/Order");

// POST /api/orders — Place a new order
const placeOrder = async (req, res) => {
  try {
    const { cart, shippingAddress, paymentMethod, userId } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!shippingAddress || !shippingAddress.name) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address is required" });
    }
    if (!paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Payment method is required" });
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping = subtotal > 1999 ? 0 : 99;
    const total = subtotal + shipping;

    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const order = await Order.create({
      user: userId || undefined,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        material: item.material,
        category: item.category,
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      estimatedDelivery,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: {
        orderId: order.orderId,
        total: order.total,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/orders — Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/:orderId — Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { placeOrder, getAllOrders, getOrderById };
