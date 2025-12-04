-- =========================
-- BẢNG NGƯỜI DÙNG
-- =========================
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin','admin','user') DEFAULT 'user',
  skin_type ENUM('da_dau','da_kho','hon_hop','nhay_cam','tat_ca') DEFAULT 'tat_ca',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger: tự sinh UUID nếu không nhập id
DELIMITER //
CREATE TRIGGER before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG DANH MỤC
-- =========================
CREATE TABLE categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER before_insert_categories
BEFORE INSERT ON categories
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG SẢN PHẨM
-- =========================
CREATE TABLE products (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  rating FLOAT DEFAULT 0,
  skin_type ENUM('da_dau','da_kho','hon_hop','nhay_cam','tat_ca') DEFAULT 'tat_ca',
  created_by CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

DELIMITER //
CREATE TRIGGER before_insert_products
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG TRUNG GIAN: product_categories
-- =========================
CREATE TABLE product_categories (
  id CHAR(36) PRIMARY KEY,
  product_id CHAR(36),
  category_id CHAR(36),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE (product_id, category_id)
);

DELIMITER //
CREATE TRIGGER before_insert_product_categories
BEFORE INSERT ON product_categories
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG GIỎ HÀNG
-- =========================
CREATE TABLE carts (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

DELIMITER //
CREATE TRIGGER before_insert_carts
BEFORE INSERT ON carts
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- CHI TIẾT GIỎ HÀNG
-- =========================
CREATE TABLE cart_items (
  id CHAR(36) PRIMARY KEY,
  cart_id CHAR(36),
  product_id CHAR(36),
  quantity INT DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

DELIMITER //
CREATE TRIGGER before_insert_cart_items
BEFORE INSERT ON cart_items
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG ĐƠN HÀNG
-- =========================
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  total DECIMAL(10,2),
  status ENUM('pending','processing','shipped','completed','cancelled') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

DELIMITER //
CREATE TRIGGER before_insert_orders
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- CHI TIẾT ĐƠN HÀNG
-- =========================
CREATE TABLE order_items (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36),
  product_id CHAR(36),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

DELIMITER //
CREATE TRIGGER before_insert_order_items
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG ĐÁNH GIÁ SẢN PHẨM
-- =========================
CREATE TABLE reviews (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  product_id CHAR(36),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

DELIMITER //
CREATE TRIGGER before_insert_reviews
BEFORE INSERT ON reviews
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;


-- =========================
-- BẢNG LỊCH SỬ HOẠT ĐỘNG
-- =========================
CREATE TABLE activity_logs (
  id CHAR(36) PRIMARY KEY,
  admin_id CHAR(36),
  action VARCHAR(255),
  target_table VARCHAR(100),
  target_id CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

DELIMITER //
CREATE TRIGGER before_insert_activity_logs
BEFORE INSERT ON activity_logs
FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    SET NEW.id = UUID();
  END IF;
END//
DELIMITER ;
