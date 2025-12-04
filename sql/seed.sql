-- =========================
-- USERS
-- =========================
INSERT INTO users
    (id, name, email, password, role, skin_type, created_at)
VALUES
    ('u1', 'Admin', 'admin@example.com', 'hashed_admin_pw', 'super_admin', 'tat_ca', NOW()),
    ('u2', 'Minh Đỗ', 'minh@example.com', 'hashed_user_pw', 'user', 'hon_hop', NOW()),
    ('u3', 'Thảo', 'thao@example.com', 'hashed_admin_pw', 'admin', 'da_dau', NOW());

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories
    (id, name, description, created_at)
VALUES
    ('c1', 'Chăm sóc da mặt', 'Sản phẩm làm sạch và dưỡng da', NOW()),
    ('c2', 'Dưỡng ẩm', 'Kem và serum dưỡng ẩm', NOW()),
    ('c3', 'Trang điểm', 'Các sản phẩm makeup', NOW()),
    ('c4', 'Chống nắng', 'Kem chống nắng và bảo vệ da', NOW());

-- =========================
-- PRODUCTS
-- =========================
INSERT INTO products
    (id, name, description, price, image_url, stock, rating, skin_type, created_by, created_at)
VALUES
    ('pr1', 'Sữa rửa mặt Senka Perfect Whip', 'Làm sạch sâu, phù hợp da dầu', 95000, 'https://example.com/pr1.jpg', 100, 4.6, 'da_dau', 'u3', NOW()),
    ('pr2', 'Toner Hada Labo Gokujyun', 'Cấp ẩm sâu, cân bằng độ pH', 150000, 'https://example.com/pr2.jpg', 80, 4.8, 'tat_ca', 'u3', NOW()),
    ('pr3', 'Kem dưỡng ẩm CeraVe', 'Phục hồi hàng rào bảo vệ da', 250000, 'https://example.com/pr3.jpg', 60, 4.9, 'da_kho', 'u3', NOW()),
    ('pr4', 'Kem chống nắng Anessa', 'Bảo vệ da dưới ánh nắng mạnh', 350000, 'https://example.com/pr4.jpg', 50, 4.7, 'tat_ca', 'u3', NOW()),
    ('pr5', 'Serum Vitamin C Melano', 'Làm sáng da, mờ thâm nám', 290000, 'https://example.com/pr5.jpg', 70, 4.8, 'hon_hop', 'u3', NOW()),
    ('pr6', 'Kem dưỡng ẩm Neutrogena Hydro Boost', 'Cấp ẩm tức thì cho da dầu', 230000, 'https://example.com/pr6.jpg', 75, 4.6, 'da_dau', 'u3', NOW()),
    ('pr7', 'Sữa rửa mặt Simple', 'Làm sạch nhẹ dịu cho da nhạy cảm', 120000, 'https://example.com/pr7.jpg', 90, 4.5, 'nhay_cam', 'u3', NOW()),
    ('pr8', 'Kem chống nắng La Roche-Posay', 'Chống nắng phổ rộng SPF50+', 380000, 'https://example.com/pr8.jpg', 40, 4.9, 'tat_ca', 'u3', NOW()),
    ('pr9', 'Son dưỡng môi DHC', 'Dưỡng mềm môi tự nhiên', 120000, 'https://example.com/pr9.jpg', 200, 4.7, 'tat_ca', 'u3', NOW()),
    ('pr10', 'Phấn nước Laneige Neo Cushion', 'Che phủ hoàn hảo, finish tự nhiên', 450000, 'https://example.com/pr10.jpg', 35, 4.8, 'tat_ca', 'u3', NOW()),
    ('pr11', 'Tẩy trang Bioderma Sensibio H2O', 'Làm sạch lớp makeup, không gây khô da', 320000, 'https://example.com/pr11.jpg', 55, 4.9, 'tat_ca', 'u3', NOW()),
    ('pr12', 'Serum Niacinamide The Ordinary', 'Giảm mụn, se khít lỗ chân lông', 290000, 'https://example.com/pr12.jpg', 65, 4.8, 'da_dau', 'u3', NOW()),
    ('pr13', 'Kem dưỡng ban đêm Innisfree Green Tea', 'Dưỡng ẩm sâu cho da khô', 270000, 'https://example.com/pr13.jpg', 50, 4.7, 'da_kho', 'u3', NOW()),
    ('pr14', 'Toner Klairs Supple Preparation', 'Dưỡng ẩm và làm dịu da nhạy cảm', 310000, 'https://example.com/pr14.jpg', 45, 4.9, 'nhay_cam', 'u3', NOW()),
    ('pr15', 'Mặt nạ Mediheal Tea Tree', 'Giảm mụn, làm dịu da dầu', 30000, 'https://example.com/pr15.jpg', 300, 4.8, 'da_dau', 'u3', NOW()),
    ('pr16', 'Kem nền Maybelline Fit Me', 'Che phủ tự nhiên, kiềm dầu', 220000, 'https://example.com/pr16.jpg', 120, 4.6, 'hon_hop', 'u3', NOW()),
    ('pr17', 'Kem dưỡng Olay Regenerist', 'Chống lão hóa, làm săn da', 490000, 'https://example.com/pr17.jpg', 40, 4.9, 'tat_ca', 'u3', NOW()),
    ('pr18', 'Tinh chất Snail Truecica', 'Phục hồi và tái tạo da sau mụn', 350000, 'https://example.com/pr18.jpg', 55, 4.8, 'hon_hop', 'u3', NOW()),
    ('pr19', 'Kem chống nắng Biore UV Aqua Rich', 'Chất mỏng nhẹ, không bí da', 210000, 'https://example.com/pr19.jpg', 80, 4.6, 'tat_ca', 'u3', NOW()),
    ('pr20', 'Son kem Black Rouge A12', 'Màu đỏ gạch hot trend', 170000, 'https://example.com/pr20.jpg', 150, 4.7, 'tat_ca', 'u3', NOW());

-- =========================
-- PRODUCT_CATEGORIES
-- (Sản phẩm có thể thuộc nhiều danh mục)
-- =========================
INSERT INTO product_categories
    (id, product_id, category_id)
VALUES
    ('pc1', 'pr1', 'c1'),
    ('pc2', 'pr2', 'c2'),
    ('pc3', 'pr3', 'c2'),
    ('pc4', 'pr4', 'c4'),
    ('pc5', 'pr5', 'c1'),
    ('pc6', 'pr6', 'c2'),
    ('pc7', 'pr7', 'c1'),
    ('pc8', 'pr8', 'c4'),
    ('pc9', 'pr9', 'c3'),
    ('pc10', 'pr10', 'c3'),
    ('pc11', 'pr11', 'c1'),
    ('pc12', 'pr12', 'c1'),
    ('pc13', 'pr13', 'c2'),
    ('pc14', 'pr14', 'c2'),
    ('pc15', 'pr15', 'c1'),
    ('pc16', 'pr16', 'c3'),
    ('pc17', 'pr17', 'c2'),
    ('pc18', 'pr18', 'c1'),
    ('pc19', 'pr19', 'c4'),
    ('pc20', 'pr20', 'c3');

-- =========================
-- REVIEWS (ví dụ vài đánh giá mẫu)
-- =========================
INSERT INTO reviews
    (id, user_id, product_id, rating, comment, created_at)
VALUES
    ('r1', 'u2', 'pr1', 5, 'Sữa rửa mặt rất sạch và mịn da.', NOW()),
    ('r2', 'u2', 'pr3', 4, 'Dưỡng ẩm ổn, thấm nhanh.', NOW()),
    ('r3', 'u2', 'pr10', 5, 'Phấn nước che phủ tốt, màu tự nhiên.', NOW());

-- =========================
-- ACTIVITY_LOGS
-- =========================
INSERT INTO activity_logs
    (id, admin_id, action, target_table, target_id, created_at)
VALUES
    ('log1', 'u3', 'Thêm sản phẩm mới', 'products', 'pr18', NOW()),
    ('log2', 'u1', 'Xóa sản phẩm lỗi', 'products', 'pr15', NOW());
