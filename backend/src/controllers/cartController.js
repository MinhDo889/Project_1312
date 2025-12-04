import { v4 as uuid } from "uuid";
import { Cart, CartItem, Product } from "../models/index.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          include: [{ model: Product }],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ id: uuid(), user_id: userId });
      return res.json({ ...cart.toJSON(), CartItems: [] });
    }

    return res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ id: uuid(), user_id: userId });
    }

    let item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id,
      },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({
        id: uuid(),
        cart_id: cart.id,
        product_id,
        quantity,
      });
    }

    return res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findByPk(item_id);
    if (!item) return res.status(404).json({ error: "Cart Item Not Found" });

    item.quantity = quantity;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// REMOVE ITEM
export const removeCartItem = async (req, res) => {
  try {
    const { item_id } = req.params;

    const item = await CartItem.findByPk(item_id);
    if (!item) return res.status(404).json({ error: "Item Not Found" });

    await item.destroy();

    res.json({ message: "Item Removed" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) return res.json({ message: "Cart already empty" });

    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
