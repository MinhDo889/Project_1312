import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import RegisterPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/Categories_details";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Components
import ProductAdmin from "./admin/ProductAdmin";
import OrderAdmin from "./admin/orderAdmin";
import ManageAdmin from "./admin/manageAdmin"; // ✅ Sửa tên + đường dẫn

// Main pages
import Product from "./pages/main/Product";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product_list" element={<ProductPage />} />
        <Route path="/category_list" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/product" element={<Product />} />
        {/* Cart / Profile / Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile/:user_id" element={<ProfilePage />} />
        <Route path="/checkout/:user_id" element={<CheckoutPage />} />
        {/* Search */}
        <Route path="/search" element={<SearchPage />} />
        {/* Admin */}
        <Route path="/product_admin" element={<ProductAdmin />} />
        <Route path="/order_admin" element={<OrderAdmin />} />
        <Route path="/manage_admin" element={<ManageAdmin />} />{" "}
        {/* ← Sửa hoàn chỉnh */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
