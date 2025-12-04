import { validationResult } from "express-validator";
import User from "../models/user_models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===========================
// 🧩 Helper tạo JWT
// ===========================
const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      skin_type: user.skin_type,
    },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  );
};

// ===========================
// 🧩 REGISTER – lưu DB, chưa verify
// ===========================
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, skin_type } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo mã xác thực 6 chữ số
    const verification_code = Math.floor(100000 + Math.random() * 900000).toString();

    // Tạo user trong DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      skin_type,
      role: "user",
      is_verified: false,
      verification_code,
    });

    // Trả về email + code cho FE gửi EmailJS
    res.status(201).json({
      message: "Đăng ký thành công, vui lòng xác thực email",
      email: newUser.email,
      verification_code: newUser.verification_code,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// 🧩 VERIFY ACCOUNT
// ===========================
export const verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "Không tìm thấy user" });
    if (user.verification_code !== code)
      return res.status(400).json({ message: "Mã xác thực không đúng" });

    // Cập nhật trạng thái verified
    await user.update({
      is_verified: true,
      verified_at: new Date(),
      verification_code: null,
    });

    // Tạo JWT
    const token = createToken(user);

    res.status(200).json({
      message: "Xác thực thành công",
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// 🧩 LOGIN
// ===========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    if (!user.is_verified)
      return res.status(403).json({ message: "Tài khoản chưa xác thực email!" });

    const token = createToken(user);

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
