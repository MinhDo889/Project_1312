// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // backend port 3001
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor nếu cần attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
