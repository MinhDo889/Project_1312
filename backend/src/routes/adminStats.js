// backend/src/routes/adminStats.js
import express from "express";
import { fn, col, literal } from "sequelize";
import { Order, User } from "../models/index.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // 1. Tổng doanh thu
    const totalRevenue = await Order.sum("total", {
      where: { status: "completed" },
    });

    // 2. Tổng đơn hàng
    const totalOrders = await Order.count();

    // 3. Tổng người dùng
    const totalUsers = await User.count();

    // 4. Thống kê trạng thái đơn hàng
    const orderStatusRaw = await Order.findAll({
      attributes: ["status", [fn("COUNT", col("status")), "count"]],
      group: ["status"],
    });

    const orderStatus = orderStatusRaw.map((item) => ({
      status: item.status,
      count: parseInt(item.getDataValue("count")),
    }));

    // 5. Doanh thu theo ngày (Group by DATE, timezone +07:00)
    const revenueByDayRaw = await Order.findAll({
      where: { status: "completed" },
      attributes: [
        [fn("DATE", literal("CONVERT_TZ(created_at, '+00:00', '+07:00')")), "date"],
        [fn("SUM", col("total")), "revenue"],
      ],
      group: [literal("DATE(CONVERT_TZ(created_at, '+00:00', '+07:00'))")],
      order: [[literal("DATE(CONVERT_TZ(created_at, '+00:00', '+07:00'))"), "ASC"]],
    });

    const revenueByDay = revenueByDayRaw.map((item) => ({
      date: item.getDataValue("date"),
      revenue: parseFloat(item.getDataValue("revenue")),
    }));

    res.json({
      totalRevenue: totalRevenue || 0,
      totalOrders,
      totalUsers,
      orderStatus,
      revenueByDay,
    });
  } catch (error) {
    console.error("ERROR STATS:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
