// src/routes/order_routes.js
import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getOrderDetail,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order_controller.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================
// 🛒 USER ROUTES
// =====================

// Tạo đơn hàng (user)
router.post(
  "/create",
  verifyToken,
  authorizeRoles("user", "admin", "super_admin"), // user và admin đều có thể tạo đơn (nếu muốn admin tạo thử)
  createOrder
);

// Lấy tất cả đơn hàng của 1 user
router.get(
  "/user/:user_id",
  verifyToken,
  authorizeRoles("user", "admin", "super_admin"),
  getOrdersByUser
);

// Xem chi tiết 1 đơn hàng
router.get(
  "/:order_id",
  verifyToken,
  authorizeRoles("user", "admin", "super_admin"),
  getOrderDetail
);

// =====================
// 🛠️ ADMIN ROUTES
// =====================

// Xem tất cả đơn hàng (admin)
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  getAllOrders
);

// Cập nhật trạng thái đơn hàng
router.put(
  "/:order_id/status",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  updateOrderStatus
);

// Xóa đơn hàng
router.delete(
  "/:order_id",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  deleteOrder
);

export default router;
