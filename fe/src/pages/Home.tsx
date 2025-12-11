import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import ProductPage from "../pages/ProductPage";
import CategoriesPage from "../pages/CategoriesPage";

import Footer from "../common/Footer"; // ⭐ THÊM FOOTER

import banner1 from "../imgList/banner1.jpg";
import banner2 from "../imgList/banner2.jpg";
import banner3 from "../imgList/banner3.jpg";

const banners = [banner1, banner2, banner3];

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // tự động chuyển banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // click vào ảnh => chuyển sang ảnh tiếp theo
  const handleBannerClick = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <>
      <Header />

      {/* Banner */}
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          position: "relative",
          height: "450px",
          borderRadius: "10px",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={handleBannerClick}
      >
        {banners.map((banner, idx) => (
          <img
            key={idx}
            src={banner}
            alt={`Banner ${idx}`}
            style={{
              width: "100%",
              height: "450px",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: currentIndex === idx ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              zIndex: currentIndex === idx ? 1 : 0,
            }}
          />
        ))}

        {/* Dots indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            zIndex: 2,
          }}
        >
          {banners.map((_, idx) => (
            <span
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              style={{
                width: currentIndex === idx ? "12px" : "8px",
                height: currentIndex === idx ? "12px" : "8px",
                background: currentIndex === idx ? "#d6336c" : "#fff",
                borderRadius: "50%",
                display: "inline-block",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            ></span>
          ))}
        </div>
      </div>

      <CategoriesPage />
      <ProductPage />

      {/* ⭐ THÊM FOOTER Ở ĐÂY */}
      <Footer />
    </>
  );
};

export default Home;
