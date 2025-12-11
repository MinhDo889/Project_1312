import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import "./manageAdmin.css";
import { fetchProducts } from "../redux/slices/productSlice";

import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

import { Doughnut, Line, Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";

ChartJS.register(
  ArcElement,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

// ======================= BASE URL =======================
const BASE_URL = "http://localhost:3001";

interface OrderStatus {
  status: string;
  count: number;
}

interface RevenueByDay {
  date: string;
  revenue: number;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  orderStatus: OrderStatus[];
  revenueByDay: RevenueByDay[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // =============== FILTER LOW STOCK PRODUCTS ===============
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) < 10);

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const pages = [
    { name: "Quản lý Sản phẩm", path: "/product_admin" },
    { name: "Quản lý Đơn hàng", path: "/order_admin" },
    { name: "Quản lý Danh Mục", path: "/categories_admin" },
  ];

  useEffect(() => {
    fetch(`${BASE_URL}/admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredRevenue =
    stats?.revenueByDay.filter((item) => {
      const [year, month] = item.date.split("-");
      if (selectedYear !== "all" && selectedYear !== year) return false;
      if (selectedMonth !== "all" && selectedMonth !== month) return false;
      return true;
    }) || [];

  const revenueData = {
    labels: filteredRevenue.map((i) => i.date),
    datasets: [
      {
        label: "Revenue",
        data: filteredRevenue.map((i) => i.revenue),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54,162,235,0.4)",
        tension: 0.3,
      },
    ],
  };

  const orderChartData = stats && {
    labels: stats.orderStatus.map((i) => i.status),
    datasets: [
      {
        label: "Order Status",
        data: stats.orderStatus.map((i) => i.count),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffcd56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
      },
    ],
  };

  const allYears = Array.from(
    new Set(stats?.revenueByDay.map((i) => i.date.split("-")[0]) || [])
  );

  return (
    <>
      <Header />

      <div className="admin-dashboard-container">
        {/* LEFT PANEL */}
        <div className="admin-left">
          <h2>Quản lý</h2>

          <div className="admin-grid">
            {pages.map((item) => (
              <button
                key={item.path}
                className="admin-card-btn"
                onClick={() => navigate(item.path)}
              >
                <h2>{item.name}</h2>
              </button>
            ))}
          </div>

          {/* ================= LOW STOCK PRODUCT LIST ================= */}
          <div className="chart-section">
            <h2>SẢN PHẨM SẮP HẾT HÀNG</h2>

            {lowStockProducts.length === 0 ? (
              <p className="no-low-stock">Tất cả sản phẩm đều đủ tồn kho.</p>
            ) : (
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Tồn kho</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={
                            p.image_url
                              ? `${BASE_URL}/${p.image_url.replace(/^\/+/, "")}`
                              : "/no-image.png"
                          }
                          alt={p.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      </td>

                      <td>{p.name}</td>

                      <td
                        style={{
                          color: (p.stock ?? 0) < 5 ? "red" : "orange",
                          fontWeight: "bold",
                        }}
                      >
                        {p.stock ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="admin-right">
          {stats && (
            <div className="stats-section">
              <h2>Thống kê hệ thống</h2>

              <div className="stats-cards">
                <div className="card">
                  <h3>Tổng doanh thu</h3>
                  <p>{stats.totalRevenue.toLocaleString("vi-VN")}.000 VNĐ</p>
                </div>
                <div className="card">
                  <h3>Tổng đơn hàng</h3>
                  <p>{stats.totalOrders}</p>
                </div>
                <div className="card">
                  <h3>Tổng người dùng</h3>
                  <p>{stats.totalUsers}</p>
                </div>
              </div>

              {/* ORDER STATUS CHART */}
              <div className="chart-section">
                <h3>Biểu đồ trạng thái đơn hàng</h3>

                {/* ==== SMALLER DONUT CHART ==== */}
                <div
                  style={{ width: "300px", height: "300px", margin: "0 auto" }}
                >
                  {orderChartData && (
                    <Doughnut
                      data={orderChartData}
                      options={{ maintainAspectRatio: false }}
                    />
                  )}
                </div>
              </div>

              {/* REVENUE CHART */}
              <div className="chart-section">
                <h3>Doanh thu theo ngày</h3>

                <div className="filter-row">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="all">Tất cả năm</option>
                    {allYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="all">Tất cả tháng</option>
                    {Array.from({ length: 12 }, (_, i) =>
                      (i + 1).toString().padStart(2, "0")
                    ).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={chartType}
                    onChange={(e) =>
                      setChartType(e.target.value as "line" | "bar")
                    }
                  >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                  </select>
                </div>

                {/* ==== SMALLER REVENUE CHART ==== */}
                <div
                  style={{ width: "600px", height: "300px", margin: "0 auto" }}
                >
                  {chartType === "line" ? (
                    <Line
                      data={revenueData}
                      options={{ maintainAspectRatio: false }}
                    />
                  ) : (
                    <Bar
                      data={revenueData}
                      options={{ maintainAspectRatio: false }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
