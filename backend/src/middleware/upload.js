import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Hàm chọn thư mục đích tùy theo route
const getUploadPath = (req, file) => {
  // Kiểm tra nếu route có chữ "product" -> lưu vào products
  if (req.baseUrl.includes("product")) {
    return "uploads/products";
  }
  // Mặc định lưu avatar
  return "uploads/avatars";
};

// ✅ Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadPath(req, file);
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ Cấu hình upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error("Chỉ được upload ảnh .jpeg, .jpg, .png, .webp!"));
  },
});

export default upload;
