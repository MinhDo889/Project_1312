import express from "express";
import { body } from "express-validator";
import { register, login, verifyAccount } from "../controllers/auth_controllers.js";

const router = express.Router();

// -----------------------------
// Route đăng ký
// Tạo user + sinh verification_code → FE gửi EmailJS
// -----------------------------
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  register
);

// -----------------------------
// Route đăng nhập
// Chặn login nếu is_verified = false
// -----------------------------
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// -----------------------------
// Route xác thực tài khoản bằng mã
// FE gửi email + verification_code
// -----------------------------
router.post(
  "/verify",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("code").notEmpty().withMessage("Verification code is required"),
  ],
  verifyAccount
);

export default router;
