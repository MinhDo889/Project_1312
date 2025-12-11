import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchProducts } from "../redux/slices/productSlice";
import type { Product } from "../redux/types/auth";
import "./css/ProductPage.css";

const BASE_URL = "http://localhost:3001";

const ProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCardClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="product_page-container">
      {loading && (
        <div className="product_page-list">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="product_page-card skeleton">
                <div className="product_page-image"></div>
                <div className="product_page-name"></div>
                <div className="product_page-price"></div>
              </div>
            ))}
        </div>
      )}

      {error && <p className="product_page-error">{error}</p>}

      {!loading && products.length > 0 ? (
        <div className="product_page-list">
          {products.map((p: Product) => (
            <div
              key={p.id}
              className="product_page-card"
              onClick={() => handleCardClick(p.id)}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {p.image_url ? (
                <img
                  src={
                    p.image_url.startsWith("http")
                      ? p.image_url
                      : `${BASE_URL}${p.image_url}`
                  }
                  alt={p.name}
                  className="product_page-image"
                />
              ) : (
                <div className="product_page-image-fallback">No Image</div>
              )}

              <h3 className="product_page-name">{p.name}</h3>
              <p className="product_page-price">
                {p.price?.toLocaleString()} VND
              </p>

              {/* Overlay */}
              {hoveredId === p.id && (
                <div className="product_page-overlay">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(p.id);
                    }}
                    className="product_page-view_detail"
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="product_page-empty">Chưa có sản phẩm nào</p>
      )}
    </div>
  );
};

export default ProductPage;
