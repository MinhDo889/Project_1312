// src/pages/CategoryDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCategoryById,
  type CategoryState,
} from "../redux/slices/categoriesSilce";
import type { RootState, AppDispatch } from "../redux/store";

import Header from "../common/Header";
import Footer from "../common/Footer"; // ✅ THÊM FOOTER

import "./css/Categories_details.css";

const BASE_URL = "http://localhost:3001";

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { categoryDetail, loading, error } = useSelector<
    RootState,
    CategoryState
  >((state) => state.categories);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  if (loading) return <p>Đang tải chi tiết danh mục...</p>;
  if (error) return <p>Lỗi khi tải danh mục: {error}</p>;
  if (!categoryDetail) return <p>Không tìm thấy danh mục</p>;

  // Lọc sản phẩm: chỉ hiển thị chưa ẩn và còn hàng
  const visibleProducts = categoryDetail.products?.filter(
    (p) => !p.is_hidden && (p.stock ?? 0) > 0
  );

  // Filter theo tên
  const filteredProducts = visibleProducts?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort sản phẩm
  const sortedProducts = filteredProducts?.sort((a, b) => {
    if (sortOption === "price-asc") return (a.price || 0) - (b.price || 0);
    if (sortOption === "price-desc") return (b.price || 0) - (a.price || 0);
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <>
      <Header />
      <div className="cat-detail-wrapper">
        {/* Bộ lọc bên trái */}
        <aside className="cat-filter-panel">
          <h3>Lọc sản phẩm</h3>

          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sắp xếp</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="cat-product-section">
          <header className="cat-header">
            <h1 className="cat-title">{categoryDetail.name}</h1>
            <p className="cat-description">{categoryDetail.description}</p>
          </header>

          <div className="cat-product-grid">
            {sortedProducts && sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="cat-product-card"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.image_url ? (
                    <img
                      src={
                        product.image_url.startsWith("http")
                          ? product.image_url
                          : `${BASE_URL}${product.image_url}`
                      }
                      alt={product.name}
                      className="cat-product-img"
                    />
                  ) : (
                    <div className="cat-product-img-fallback">No Image</div>
                  )}
                  <h3 className="cat-product-name">{product.name}</h3>
                  <p className="cat-product-price">
                    {product.price?.toLocaleString()} VNĐ
                  </p>
                </div>
              ))
            ) : (
              <p className="cat-empty">Danh mục chưa có sản phẩm.</p>
            )}
          </div>
        </main>
      </div>
      <Footer /> {/* ✅ FOOTER HIỆN CUỐI TRANG */}
    </>
  );
};

export default CategoryDetailPage;
