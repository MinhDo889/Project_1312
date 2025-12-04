import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/product_controller.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../middleware/upload_product.js";

const router = express.Router();

// =====================
// 🛍️ ROUTES SẢN PHẨM
// =====================

// Ai cũng xem được danh sách và chi tiết sản phẩm
router.get("/", getAllProducts);

// 🔹 Move /search trước /:id
router.get("/search", searchProducts);

// Chi tiết sản phẩm theo id
router.get("/:id", getProductById);

// Chỉ admin hoặc super_admin được thêm / sửa / xóa sản phẩm
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  uploadProductImage.single("image"),
  createProduct
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "super_admin"),
  uploadProductImage.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  deleteProduct
);

export default router;
