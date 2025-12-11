import React from "react";
import "./Footer.css";
import logon from "../imgList/logon.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* === GIỚI THIỆU === */}
        <div className="footer-col">
          <h3>D$&Care</h3>

          <p>
            D$&Care – Cửa hàng chuyên phân phối các sản phẩm làm đẹp từ nhiều
            thương hiệu cao cấp. Thuộc quyền sở hữu Công ty TNHH D$&Care.
          </p>

          <p>
            GPKD số: 0123456789 do Sở KHĐT TP.HCM cấp ngày 01/01/2020. <br />
            Địa chỉ: 258/69 Trần Hưng Đạo, Q1, TP.HCM.
          </p>

          <p className="footer-item">
            <span>📍</span> 86 Dương Đức Hiền, Tân Phú, TP.HCM
          </p>

          <p className="footer-item">
            <span>📞</span> 0901 123 456 / 0932 654 321
          </p>

          <p className="footer-item">
            <span>✉️</span> contact@dscare.vn
          </p>

          {/* LOGO */}
          <div className="footer-logo-box">
            {/* Thay ảnh logo của bạn tại đây */}
            <img src={logon} alt="D$&Care Logo" className="footer-logo" />
          </div>
        </div>

        {/* === CHÍNH SÁCH === */}
        <div className="footer-col">
          <h4>CHÍNH SÁCH</h4>
          <ul>
            <li>Giới Thiệu Về D$&Care</li>
            <li>Điều Khoản Dịch Vụ</li>
            <li>Chính Sách Vận Chuyển</li>
            <li>Chính Sách Đổi Trả</li>
            <li>Hướng Dẫn Thanh Toán</li>
            <li>Chính Sách Bảo Mật</li>
            <li>Thông Tin Hàng Hóa</li>
            <li>Chính Sách Sỉ</li>
          </ul>
        </div>

        {/* === HỖ TRỢ === */}
        <div className="footer-col">
          <h4>HỖ TRỢ KHÁCH HÀNG</h4>
          <ul>
            <li>Tìm Kiếm</li>
            <li>Sản Phẩm Khuyến Mãi</li>
            <li>Tất cả sản phẩm</li>
            <li>Hướng Dẫn Thanh Toán</li>
            <li>Kiểm Tra Đơn Hàng</li>
            <li>Trả Góp 0%</li>
          </ul>
        </div>

        {/* === KẾT NỐI === */}
        <div className="footer-col">
          <h4>KẾT NỐI VỚI CHÚNG TÔI</h4>

          {/* Email */}
          <div className="email-box">
            <input type="text" placeholder="Email" />
            <span className="send-icon">✈️</span>
          </div>

          {/* Social */}
          <div className="social-icons">
            <img
              src="https://i.pinimg.com/736x/82/53/22/82532235b1c99e391706a9c6e396aeaa.jpg"
              alt="Zalo"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/1024px-Tiktok_icon.svg.png"
              alt="Tiktok"
            />
            <img
              src="https://thietkewebchuyen.com/wp-content/uploads/logo-youtube-tron-3.jpg"
              alt="YouTube"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
