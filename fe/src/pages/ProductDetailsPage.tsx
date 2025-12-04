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

const BASE_URL = "http://localhost:3001";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const {
    productDetail: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [addedEffect, setAddedEffect] = useState(false);
  const [addedText, setAddedText] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => {
      dispatch(clearProductDetail());
    };
  }, [id, dispatch]);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
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

  if (loading) return <p className="pd-loading">Đang tải...</p>;
  if (error) return <p className="pd-error">{error}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

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
              {product.price.toLocaleString()}0 VNĐ
            </p>
            <p className="pd-price-old">
              {(product.price * 1.2).toLocaleString()}00 VNĐ
            </p>
            <span className="pd-discount">-20%</span>
          </div>

          {/* QUANTITY */}
          <div className="pd-quantity-box fancy-quantity">
            <button className="qty-btn" onClick={decrease}>
              <span className="minus-line"></span>
            </button>

            <div className="qty-display">{quantity}</div>

            <button className="qty-btn" onClick={increase}>
              <span className="plus-line"></span>
              <span className="plus-line vertical"></span>
            </button>
          </div>

          {/* TOTAL */}
          <div className="pd-total-box">
            <p>Tổng tiền:</p>
            <h2>{totalPrice.toLocaleString()}.000 VNĐ</h2>
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
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
