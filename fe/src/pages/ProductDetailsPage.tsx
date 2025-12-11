// src/pages/ProductDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import {
  fetchProductById,
  clearProductDetail,
} from "../redux/slices/productSlice";
import { addToCart, fetchCart } from "../redux/slices/cartSlice";
import Header from "../common/Header";
import { toast } from "react-toastify";
import "./css/ProductDetails.css";
import Footer from "../common/Footer";

// Review slice
import {
  fetchReviewsByProduct,
  type Review,
} from "../redux/slices/reviewSlice";

const BASE_URL = "http://localhost:3001";
// src/pages/ProductDetailsPage.tsx
// ... giữ nguyên import, useEffect, fetch product/reviews ...

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    productDetail: product,
    loading: productLoading,
    error: productError,
  } = useSelector((state: RootState) => state.products);

  const { user } = useSelector((state: RootState) => state.auth);
  const { reviews, loading: reviewLoading } = useSelector(
    (state: RootState) => state.reviews
  );

  const [quantity, setQuantity] = useState(1);
  const [addedEffect, setAddedEffect] = useState(false);
  const [addedText, setAddedText] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchReviewsByProduct(id));
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [id, dispatch]);

  // Kiểm tra is_hidden và stock
  if (productLoading) return <p className="pd-loading">Đang tải...</p>;
  if (productError) return <p className="pd-error">{productError}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;
  if (product.is_hidden || (product.stock ?? 0) <= 0)
    return <p>Sản phẩm hiện không khả dụng</p>;

  // CHỈNH LẠI QUANTITY: không vượt quá stock
  const increase = () => {
    if (quantity < (product.stock ?? 1)) setQuantity((q) => q + 1);
  };
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    if (quantity > (product.stock ?? 0)) {
      toast.error(`Chỉ còn ${product.stock ?? 0} sản phẩm trong kho!`);
      setQuantity(product.stock ?? 1);
      return;
    }

    try {
      await dispatch(addToCart({ product_id: product.id, quantity })).unwrap();
      dispatch(fetchCart());
      toast.success(`${product.name} đã được thêm vào giỏ hàng!`);

      setAddedEffect(true);
      setAddedText(true);
      setTimeout(() => setAddedEffect(false), 500);
      setTimeout(() => setAddedText(false), 2000);
    } catch {
      toast.error("Thêm vào giỏ hàng thất bại. Vui lòng thử lại!");
    }
  };

  const imageUrl = product.image_url?.startsWith("http")
    ? product.image_url
    : `${BASE_URL}${product.image_url}`;

  const totalPrice = product.price * quantity;

  return (
    <>
      <Header />
      <div className="pd-wrapper">
        {/* LEFT */}
        <div className="pd-left">
          <div className="pd-main-img-box">
            <img className="pd-main-img" src={imageUrl} alt={product.name} />
          </div>
          <div className="pd-thumbs">
            {[imageUrl, imageUrl, imageUrl].map((img, i) => (
              <img key={i} src={img} className="pd-thumb-img" alt="" />
            ))}
          </div>
          <div className="pd-share">
            <span>Chia sẻ:</span>
            <button className="pd-share-btn">Facebook</button>
            <button className="pd-share-btn">Pinterest</button>
            <button className="pd-share-btn">Twitter</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pd-right">
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-price-box">
            <p className="pd-price-sale">
              {product.price.toLocaleString()} VNĐ
            </p>
            <p className="pd-price-old">
              {(product.price * 1.2).toLocaleString()}00 VNĐ
            </p>
            <span className="pd-discount">-20%</span>
          </div>

          {/* QUANTITY */}
          <div className="pd-quantity-box fancy-quantity">
            <button className="qty-btn" onClick={decrease}>
              <span className="minus-line">-</span>
            </button>
            <div className="qty-display">{quantity}</div>
            <button className="qty-btn" onClick={increase}>
              <span className="plus-line">+</span>
              <span className="plus-line vertical"></span>
            </button>
          </div>

          {/* TOTAL */}
          <div className="pd-total-box">
            <h2>Tổng Tiền: {totalPrice.toLocaleString()}.000 VNĐ</h2>
          </div>

          {/* BUTTONS */}
          <div className="pd-actions">
            <button
              className={`pd-add-cart ${addedEffect ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedText ? "Đã thêm" : "Thêm vào giỏ"}
            </button>
          </div>

          <p className="pd-description">
            {product.description || "Không có mô tả sản phẩm."}
          </p>

          {/* ===== REVIEWS ===== */}
          <div className="pd-reviews">
            <h2>Đánh giá sản phẩm</h2>
            {reviewLoading && (
              <p className="reviews-loading">Đang tải đánh giá...</p>
            )}
            {!reviewLoading && reviews.length === 0 && (
              <p className="reviews-empty">Chưa có đánh giá nào</p>
            )}
            <div className="reviews-list">
              {reviews.map((r: Review) => (
                <div key={r.id} className="review-item">
                  <div className="review-header">
                    <span className="review-user">{r.user_id}</span>
                    <span className="review-rating">⭐ {r.rating}/5</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
