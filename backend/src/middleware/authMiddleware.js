import jwt from "jsonwebtoken";

// ✅ Middleware: xác thực người dùng qua token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Không có token trong header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    // 1️⃣ Verify token: kiểm tra hợp lệ và hết hạn
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // 2️⃣ Lưu payload đã verify vào req.user
    // Đảm bảo payload có email khi tạo token
    req.user = {
      id: verified.id,
      name: verified.name,
      email: verified.email, // email có trong payload
      role: verified.role,
    };

    // 3️⃣ Log payload để kiểm tra

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

// ✅ Middleware: kiểm tra quyền theo role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực người dùng" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    next();
  };
};
