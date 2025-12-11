import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import "./BrandTimeline.css";

interface TimelineItem {
  year: string;
  title: string;
  content: string[];
}

const timelineData: TimelineItem[] = [
  {
    year: "2019",
    title: "Ý tưởng hình thành",
    content: [
      "D$&Care bắt đầu từ mong muốn tạo ra sản phẩm chăm sóc da lành tính.",
      "Thị trường còn thiếu sản phẩm minh bạch — an toàn.",
    ],
  },
  {
    year: "2020",
    title: "Nghiên cứu & thử nghiệm",
    content: [
      "Hợp tác với các phòng lab uy tín.",
      "Nghiên cứu hoạt chất Niacinamide, HA, AHA/BHA, Vitamin C...",
      "Ra đời những công thức thử nghiệm đầu tiên.",
    ],
  },
  {
    year: "2021",
    title: "Ra mắt thương hiệu",
    content: [
      "Giới thiệu bộ sản phẩm đầu tiên: sữa rửa mặt, toner, serum phục hồi.",
      "Thiết kế bao bì tối giản – hiện đại.",
    ],
  },
  {
    year: "2022",
    title: "Tăng trưởng mạnh",
    content: [
      "Phân phối trên Shopee, Tiki, TikTok Shop.",
      "Đạt 10.000+ khách hàng toàn quốc.",
      "Nhận đánh giá tích cực từ reviewer.",
    ],
  },
  {
    year: "2023",
    title: "Nâng cấp nhận diện",
    content: [
      "Đổi mới logo, màu sắc, bao bì.",
      "Hoàn thiện thông điệp: Đẹp mỗi ngày – an toàn mỗi phút.",
      "Mở rộng line sản phẩm chuyên sâu.",
    ],
  },
  {
    year: "2024",
    title: "Công nghệ hoá quy trình",
    content: [
      "Áp dụng AI phân tích da khách hàng.",
      "Chuẩn hóa sản xuất đạt CGMP.",
      "Mở rộng sang Campuchia & Thái Lan.",
    ],
  },
  {
    year: "2025",
    title: "Tầm nhìn & sứ mệnh",
    content: [
      "Trở thành thương hiệu mỹ phẩm Việt dẫn đầu.",
      "Đẩy mạnh thành phần lành tính – khoa học – cá nhân hóa.",
      "Mở rộng thị trường quốc tế.",
    ],
  },
];

const BrandTimeline: React.FC = () => {
  return (
    <>
      <Header />

      <div className="timeline-wrapper">
        <div className="timeline-container">
          <h1 className="timeline-title">
            Timeline Phát Triển Thương Hiệu
            <span className="highlight"> D$&Care</span>
          </h1>

          <div className="timeline-line">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <span className="timeline-dot" />

                <div className="timeline-card">
                  <h2 className="timeline-year">{item.year}</h2>
                  <h3 className="timeline-sub">{item.title}</h3>

                  <ul>
                    {item.content.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BrandTimeline;
