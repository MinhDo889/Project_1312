// src/pages/products/Product.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import type { Product as ProductType } from "../../redux/types/auth";
import Header from "../../common/Header";
import "./Product.css";
import CategoriesPage from "../CategoriesPage";

const BASE_URL = "http://localhost:3001";

const Product: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCardClick = (id: string) => navigate(`/products/${id}`);

  // Lọc: chỉ hiển thị sản phẩm chưa ẩn và stock > 0
  const visibleProducts = products.filter(
    (p) => !p.is_hidden && (p.stock ?? 0) > 0
  );

  // Lọc theo search term
  const filteredProducts = visibleProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sắp xếp
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "price-asc") return (a.price || 0) - (b.price || 0);
    if (sortOption === "price-desc") return (b.price || 0) - (a.price || 0);
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <>
      <Header />
      <CategoriesPage />

      <div className="product-page-wrapper">
        <div className="filter-toggle">
          <button onClick={() => setShowFilter(!showFilter)}>
            {showFilter ? "Đóng bộ lọc" : "Mở bộ lọc"}
          </button>
        </div>

        {showFilter && (
          <div className="filter-panel">
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
          </div>
        )}

        <div className="product-list-container">
          {loading && <p>Đang tải...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="product-grid">
            {sortedProducts.length > 0
              ? sortedProducts.map((p: ProductType) => (
                  <div
                    key={p.id}
                    className="product-card"
                    onClick={() => handleCardClick(p.id)}
                  >
                    {p.image_url ? (
                      <img
                        src={
                          p.image_url.startsWith("http")
                            ? p.image_url
                            : `${BASE_URL}${p.image_url}`
                        }
                        alt={p.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-fallback">No Image</div>
                    )}
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-price">
                      {p.price?.toLocaleString()} VND
                    </p>
                  </div>
                ))
              : !loading && <p>Chưa có sản phẩm nào</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
