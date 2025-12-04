// src/controllers/order_controller.js
import { v4 as uuidv4 } from "uuid";
import Order from "../models/order_models.js";
import OrderItem from "../models/order_item_models.js";
import CartItem from "../models/Cart_item.js";
import Product from "../models/product_models.js";
import User from "../models/user_models.js";

// -------------------- CREATE ORDER (CASH / PENDING) --------------------
export const createOrder = async (req, res) => {
  try {
    const { user_id, selectedItemIds } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id is required" });

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const cartItems = await CartItem.findAll({
      where: { id: selectedItemIds },
      include: [Product],
    });

    if (!cartItems.length) return res.status(400).json({ error: "No items selected" });

    const total = cartItems.reduce((sum, item) => sum + item.Product.price * item.quantity, 0);

    const order = await Order.create({
      id: uuidv4(),
      user_id,
      total,
      status: "pending",
      created_at: new Date(),
    });

    const orderItems = cartItems.map((item) => ({
      id: uuidv4(),
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    return res.status(201).json({ order });
  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------- GET ORDERS BY USER --------------------
export const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const orders = await Order.findAll({
      where: { user_id },
      include: {
        model: OrderItem,
        include: [Product],
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Get Orders By User Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------- GET ORDER DETAIL --------------------
export const getOrderDetail = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findByPk(order_id, {
      include: {
        model: OrderItem,
        include: [Product],
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    return res.status(200).json({ order });
  } catch (err) {
    console.error("Get Order Detail Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------- ADMIN: GET ALL ORDERS --------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ["id", "name", "email"] },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------- ADMIN: UPDATE ORDER STATUS --------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ order });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------- ADMIN: DELETE ORDER --------------------
export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await OrderItem.destroy({ where: { order_id } });
    await order.destroy();

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
