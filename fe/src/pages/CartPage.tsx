import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeCartItem } from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import "./css/CartPage.css";
import bannercart from "../imgList/bannercart.jpg";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const BASE_URL = "http://localhost:3001";

  // Track selected items
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // When items change, auto-select all
  useEffect(() => {
    setSelectedItems(items.map((item) => item.id));
  }, [items]);

  const toggleSelect = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeCartItem(itemId));
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const handleCheckout = () => {
    if (!selectedItems.length) return alert("Please select items to checkout");

    const userId = localStorage.getItem("id");
    if (!userId) return alert("User not logged in");

    navigate(`/checkout/${userId}?items=${selectedItems.join(",")}`);
  };

  // Total price only for selected items
  const totalPrice = items.reduce((sum, item) => {
    if (!selectedItems.includes(item.id)) return sum;
    const price = item.Product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  if (loading) return <p className="cart-empty">Loading...</p>;

  return (
    <>
      <Header />

      <div className="cart-container">
        {items.length === 0 ? (
          <div className="empty-cart-wrapper">
            <img src={bannercart} alt="Empty Cart" className="empty-cart-img" />

            <h2 className="empty-title">“Hổng” có gì trong giỏ hết</h2>
            <p className="empty-subtitle">
              Về trang cửa hàng để chọn mua sản phẩm bạn nhé!!
            </p>

            <button
              className="empty-cart-btn"
              onClick={() => navigate("/product")}
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* LEFT LIST */}
            <div className="cart-items-box">
              {/* Select All */}
              <div className="select-all">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={toggleSelectAll}
                />
                <span>Chọn tất cả</span>
              </div>

              <ul className="cart-list">
                {items.map((item) => {
                  const product = item.Product;
                  const price = product?.price ?? 0;

                  return (
                    <li key={item.id} className="cart-item">
                      <div className="cart-item-left">
                        {/* SINGLE CHECKBOX */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="item-checkbox"
                        />

                        <img
                          src={
                            product?.image_url
                              ? `${BASE_URL}${product.image_url}`
                              : "/placeholder.png"
                          }
                          alt={product?.name ?? "Product"}
                        />

                        <div className="cart-item-details">
                          <p className="cart-item-name">{product?.name}</p>
                          <p className="cart-item-quantity">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <p className="cart-item-price">
                          {(price * item.quantity).toLocaleString("vi-VN")}.000
                          VNĐ
                        </p>

                        <button
                          className="cart-delete-btn"
                          onClick={() => handleRemove(item.id)}
                        >
                          ✖
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-line">
                <span>Sản phẩm đã chọn:</span>
                <span>{selectedItems.length}</span>
              </div>

              <div className="summary-line">
                <span>Tổng tiền:</span>
                <span className="summary-total">
                  {totalPrice.toLocaleString("vi-VN")}.000 VNĐ
                </span>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
