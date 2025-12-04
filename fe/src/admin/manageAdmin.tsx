import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import "./manageAdmin.css";

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

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const pages = [
    { name: "Quản lý Sản phẩm", path: "/product_admin" },
    { name: "Quản lý Đơn hàng", path: "/order_admin" },
  ];

  useEffect(() => {
    fetch("http://localhost:3001/admin/stats")
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
        {/* ============== LEFT PANEL ============== */}
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
        </div>

        {/* ============== RIGHT PANEL ============== */}
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

              {/* ========== ORDER STATUS CHART ========== */}
              <div className="chart-section">
                <h3>Biểu đồ trạng thái đơn hàng</h3>
                <div style={{ width: "400px", margin: "0 auto" }}>
                  <Doughnut data={orderChartData!} />
                </div>
              </div>

              {/* ========== REVENUE CHART ========== */}
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

                <div style={{ width: "850px", margin: "0 auto" }}>
                  {chartType === "line" ? (
                    <Line data={revenueData} />
                  ) : (
                    <Bar data={revenueData} />
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
