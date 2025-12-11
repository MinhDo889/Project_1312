import React from "react";

const FeatureSection: React.FC = () => {
  const features = [
    { icon: "🎀", text: "Hơn 2000 sản phẩm" },
    { icon: "🚚", text: "Giao hàng siêu tốc" },
    { icon: "💗", text: "Sản phẩm chính hãng" },
    { icon: "📦", text: "Đổi trả dễ dàng" },
    { icon: "⏰", text: "Hỗ trợ trong 24 giờ" },
    { icon: "🎁", text: "Ưu đãi hấp dẫn" },
  ];

  return (
    <>
      {/* ================= CSS VIẾT TRỰC TIẾP ================= */}
      <style>
        {`
        .feature-wrapper {
          width: 100%;
          background: linear-gradient(180deg, #fff9fb, #ffeef5);
          padding: 50px 0;
          display: flex;
          justify-content: center;
        }

        .feature-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 45px;
          max-width: 1200px;
          width: 100%;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 150px;
          text-align: center;
          cursor: default;
          transition: 0.3s ease;
        }

        .feature-icon {
          width: 75px;
          height: 75px;
          background: #ffb6c9; /* Hồng pastel */
          color: white;
          border-radius: 50%;
          font-size: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0px 4px 10px rgba(255, 182, 201, 0.5);
          transition: 0.3s ease;
        }

        .feature-item:hover .feature-icon {
          transform: scale(1.15);
          box-shadow: 0px 6px 14px rgba(255, 182, 201, 0.7);
        }

        .feature-text {
          color: #b56479; /* Text hồng nâu sang */
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        @media (max-width: 768px) {
          .feature-container {
            gap: 30px;
          }
        }
      `}
      </style>

      {/* ================= CONTENT ================= */}
      <div className="feature-wrapper">
        <div className="feature-container">
          {features.map((item, idx) => (
            <div key={idx} className="feature-item">
              <div className="feature-icon">{item.icon}</div>
              <p className="feature-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureSection;
