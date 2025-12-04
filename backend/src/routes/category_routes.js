import express from "express";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category_controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", getAllCategories);
router.post("/",verifyToken, createCategory);
router.get("/:id", getCategoryById);
router.put("/:id",verifyToken, updateCategory);
router.delete("/:id",verifyToken, deleteCategory);

export default router;
