// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { createOrder, resetOrder } from "../redux/slices/orderSlice";
import Header from "../common/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { send } from "@emailjs/browser";
import "./css/CheckoutPage.css";

const SERVICE_ID = "service_wzh1oai";
const TEMPLATE_ID = "template_m79mlqc";
const PUBLIC_KEY = "eQWJGLYw_u3FYSVuM";

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
  const { order, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  const BASE_URL = "http://localhost:3001";
  const API_BASE = "http://localhost:3001/api";

  const userId = localStorage.getItem("id");
  const userEmail = localStorage.getItem("email");

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [payment, setPayment] = useState<string>("cash");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false); // trạng thái đặt hàng thành công

  useEffect(() => {
    setSelectedItems(items.map((i) => i.id));
  }, [items]);

  const totalPrice = items.reduce((sum, item) => {
    if (!selectedItems.includes(item.id)) return sum;
    return sum + (item.Product?.price || 0) * item.quantity;
  }, 0);

  const toggleSelectItem = (itemId: string) => {
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
      setSelectedItems(items.map((i) => i.id));
    }
  };

  const sendEmailConfirmation = async (orderId: string) => {
    if (!userEmail) {
      toast.error("❌ Email người dùng không hợp lệ.");
      return;
    }

    const templateParams = {
      user_name: "Customer",
      user_email: userEmail,
      order_id: orderId,
      total_price: totalPrice.toLocaleString("vi-VN"),
      payment_method:
        payment === "cash" ? "Thanh toán khi nhận hàng" : "ZaloPay",
    };
    try {
      await send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      toast.success("📧 Email xác nhận đã được gửi!");
    } catch (err) {
      console.error("❌ Lỗi gửi email:", err);
      toast.error("❌ Không thể gửi email xác nhận.");
    }
  };

  const handleCheckout = async () => {
    if (!userId) return toast.error("❌ Bạn chưa đăng nhập!");
    if (selectedItems.length === 0)
      return toast.warning("⚠️ Vui lòng chọn sản phẩm cần thanh toán!");

    const orderRes: any = await dispatch(
      createOrder({ selectedItemIds: selectedItems })
    );

    if (!createOrder.fulfilled.match(orderRes)) {
      toast.error("❌ Lỗi tạo đơn hàng!");
      return;
    }

    const newId = orderRes.payload?.id;
    if (!newId) return toast.error("❌ Không lấy được ID đơn hàng!");

    await sendEmailConfirmation(newId);

    if (payment === "cash") {
      toast.success("🎉 Đặt hàng thành công! (Thanh toán khi nhận hàng)");
      setOrderSuccess(true); // cập nhật trạng thái thành công
      dispatch(resetOrder());
      return;
    }

    if (payment === "zalopay") {
      try {
        const res = await axios.post(`${API_BASE}/payment/zalopay`, {
          amount: totalPrice,
          orderId: newId,
        });
        if (res.status === 200 && res.data.order_url) {
          toast.success("🔗 Chuyển đến trang ZaloPay...");
          window.open(res.data.order_url, "_blank");
          setOrderSuccess(true);
          dispatch(resetOrder());
          return;
        } else {
          toast.error("❌ Không nhận được link thanh toán!");
        }
      } catch (err: any) {
        let msg = "❌ Lỗi kết nối ZaloPay";
        if (err?.response?.data?.message) msg = err.response.data.message;
        toast.error(msg);
      }
      return;
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" theme="light" autoClose={2500} />

      <div className="cart-container">
        <h1 className="cart-title">Checkout</h1>

        {orderSuccess ? (
          <div className="order-success-box">
            <h2>🎉 Đặt hàng thành công!</h2>
            <p>Mã đơn hàng: {order?.id || "Đang cập nhật..."}</p>
            <p>Tổng tiền: {totalPrice.toLocaleString("vi-VN")}.000 ₫</p>
            <button onClick={() => (window.location.href = "/product")}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* LEFT */}
            <div className="cart-items-box">
              {items.length > 0 && (
                <div className="select-all-box">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === items.length}
                    onChange={toggleSelectAll}
                  />
                  <span>Chọn tất cả</span>
                </div>
              )}

              {items.length === 0 ? (
                <p className="cart-empty">Giỏ hàng trống</p>
              ) : (
                <ul className="cart-list">
                  {items.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="cart-item">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                      <div className="cart-item-left">
                        <img
                          src={
                            item.Product?.image_url
                              ? `${BASE_URL}${item.Product.image_url}`
                              : "/default-product.png"
                          }
                          alt={item.Product?.name || "Product"}
                        />
                        <div className="cart-item-details">
                          <p>{item.Product?.name}</p>
                          <p>Số lượng: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <p>
                          {(
                            item.Product?.price || 0 * item.quantity
                          ).toLocaleString("vi-VN")}
                          ₫
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* RIGHT */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="payment-method-box">
                <p>Phương thức thanh toán:</p>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={payment === "cash"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  Thanh toán khi nhận hàng
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="zalopay"
                    checked={payment === "zalopay"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  ZaloPay
                </label>
              </div>

              <div className="summary-line">
                <span>Số sản phẩm đã chọn:</span>
                <span>{selectedItems.length}</span>
              </div>
              <div className="summary-line">
                <span>Tổng tiền:</span>
                <span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span>
              </div>
              {error && <p className="error-text">{error}</p>}

              <button
                className="checkout-btn"
                disabled={selectedItems.length === 0 || loading}
                onClick={handleCheckout}
              >
                {loading
                  ? "Đang xử lý..."
                  : payment === "zalopay"
                    ? "Thanh toán ZaloPay"
                    : "Thanh toán khi nhận hàng"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutPage;
