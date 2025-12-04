// src/pages/OrderAdmin.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrderAdmin,
} from "../redux/slices/orderSlice";
import "./OrderAdmin.css";
import Header from "../common/Header";

const statuses = [
  "all",
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

const OrderAdmin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"created_at" | "total">(
    "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (order_id: string, status: string) => {
    dispatch(updateOrderStatus({ order_id, status }));
  };

  const handleDelete = (order_id: string) => {
    if (window.confirm("Are you sure to delete this order?")) {
      dispatch(deleteOrderAdmin(order_id));
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  // =============================
  // Lọc và tìm kiếm
  // =============================
  let filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) || order.user_id.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // =============================
  // Sắp xếp
  // =============================
  filteredOrders.sort((a, b) => {
    let aValue: number | Date;
    let bValue: number | Date;

    if (sortField === "created_at") {
      aValue = new Date(a.created_at);
      bValue = new Date(b.created_at);
    } else {
      aValue =
        typeof a.total === "number"
          ? a.total
          : parseFloat(a.total as unknown as string);
      bValue =
        typeof b.total === "number"
          ? b.total
          : parseFloat(b.total as unknown as string);
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  if (loading)
    return <div className="admin-orders-container">Loading orders...</div>;
  if (error)
    return <div className="admin-orders-container text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="admin-orders-container">
        <h1>Admin Orders</h1>

        {/* ---------------- Filter & Search ---------------- */}
        <div className="order-filters">
          <input
            type="text"
            placeholder="Search by Order ID or User ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "created_at" | "total")
            }
          >
            <option value="created_at">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "Giảm " : "Tăng"}
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalNumber =
                  typeof order.total === "number"
                    ? order.total
                    : parseFloat(order.total as unknown as string) || 0;

                const isLocked =
                  order.status === "completed" || order.status === "cancelled";

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_id}</td>
                    <td>{totalNumber.toLocaleString("vi-VN")}.000 VNĐ</td>

                    {/* SELECT STATUS */}
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`status-select ${getStatusClass(order.status)}`}
                        disabled={isLocked}
                      >
                        {statuses
                          .filter((s) => s !== "all")
                          .map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td>{new Date(order.created_at).toLocaleString()}</td>

                    <td>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderAdmin;
