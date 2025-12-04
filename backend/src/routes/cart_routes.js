import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/:item_id", verifyToken, updateCartItem);
router.delete("/:item_id", verifyToken, removeCartItem);
router.delete("/clear", verifyToken, clearCart);

export default router;
