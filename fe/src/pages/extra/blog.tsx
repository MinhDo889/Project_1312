import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import "./BlogPage.css";

interface BlogPost {
  id: string;
  title: string;
  thumbnail: string;
  short_desc: string;
  date: string;
}

const dummyBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Top 5 sản phẩm chăm sóc da được yêu thích nhất 2025",
    thumbnail:
      "https://images2.thanhnien.vn/528068263637045248/2024/3/29/1-skincare-1711698574422831495498.jpg",
    short_desc:
      "Khám phá những sản phẩm skincare được đánh giá cao nhất năm 2025, phù hợp với mọi loại da.",
    date: "02/12/2025",
  },
  {
    id: "2",
    title: "Cách chọn kem chống nắng phù hợp cho từng loại da",
    thumbnail:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1200",
    short_desc:
      "Kem chống nắng là bước bắt buộc trong chu trình skincare. Vậy chọn loại nào mới đúng?",
    date: "27/11/2025",
  },
  {
    id: "3",
    title: "Trang điểm nhẹ nhàng đi học – đơn giản mà xinh",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8eATWKlUWTyOAl-s78OMz6JrwYOrjQ4wBhQ&s",
    short_desc:
      "Hướng dẫn cách makeup “no-makeup look” cực tự nhiên cho học sinh, sinh viên.",
    date: "15/11/2025",
  },
];

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // sau này thay API fetch blog
    setBlogs(dummyBlogs);
  }, []);

  return (
    <>
      <Header />

      <div className="blog-container">
        <h1 className="blog-title">✨ Blog làm đẹp & Chăm sóc da</h1>
        <p className="blog-subtitle">
          Kiến thức – Bí quyết – Review sản phẩm mỹ phẩm mới nhất.
        </p>

        <div className="blog-grid">
          {blogs.map((post) => (
            <div key={post.id} className="blog-card">
              <div className="blog-img-box">
                <img src={post.thumbnail} alt={post.title} />
              </div>

              <div className="blog-content">
                <p className="blog-date">{post.date}</p>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-desc">{post.short_desc}</p>

                <button
                  className="blog-readmore"
                  onClick={() =>
                    alert("Chức năng xem chi tiết đang phát triển")
                  }
                >
                  Đọc thêm →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;
