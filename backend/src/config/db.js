// db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Đọc file .env
dotenv.config();

// Khởi tạo kết nối Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME,       // Tên database
  process.env.DB_USER,       // Username
  process.env.DB_PASSWORD,   // Mật khẩu
  {
    host: process.env.DB_HOST,  // Host (localhost)
    port: process.env.DB_PORT,  // Cổng MySQL (3307)
    dialect: "mysql",           // Kiểu DBMS
    logging: false,             // Ẩn log SQL trong terminal (tùy chọn)
  }
);

