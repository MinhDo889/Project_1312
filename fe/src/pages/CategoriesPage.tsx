// CategoriesPage.tsx
import React, { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchCategories } from "../redux/slices/categoriesSilce";
import type { Category } from "../redux/types/auth";

import { FaSun, FaPalette, FaHeart } from "react-icons/fa";
import { FaFaceGrinWink } from "react-icons/fa6";
import { IoBody } from "react-icons/io5";

import "./css/CategoriesPage.css";

const iconMap: Record<string, JSX.Element> = {
  "Chăm sóc da mặt": <FaFaceGrinWink />,
  "Dưỡng thể": <IoBody />,
  "Trang điểm": <FaPalette />,
  "Chống nắng": <FaSun />,
  "Chăm sóc tóc": <FaHeart />,
};

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (id: string) => {
    navigate(`/categories/${id}`);
  };

  return (
    <>
      {/* Header */}

      <div className="categories-container">
        {loading && <p style={{ textAlign: "center" }}>Đang tải...</p>}
        {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

        {!loading && categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map((cat: Category, idx: number) => (
              <div
                key={cat.id}
                className="category-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <div className="category-icon">
                  {iconMap[cat.name] || <FaFaceGrinWink />}
                </div>

                <h3 className="category-name">{cat.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p style={{ textAlign: "center", color: "#999" }}>
              Chưa có danh mục nào
            </p>
          )
        )}
      </div>

      {/* Footer */}
    </>
  );
};

export default CategoriesPage;
