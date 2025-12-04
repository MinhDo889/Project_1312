import { Router } from "express";
import crypto from "crypto";
import axios from "axios";

const router = Router();

router.post("/zalopay", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    console.log("👉 [Backend] Nhận yêu cầu thanh toán:", { amount, orderId });

    if (!amount || !orderId) {
      return res.status(400).json({ message: "Thiếu amount hoặc orderId từ Frontend" });
    }

    // Trường hợp đơn hàng miễn phí
    if (Number(amount) === 0) {
      return res.status(200).json({
        order_url: null,
        app_trans_id: null,
        message: "Đơn hàng miễn phí, không cần thanh toán qua ZaloPay"
      });
    }

    // --- CẤU HÌNH ZALOPAY ---
    const ZALO_CONFIG = {
      APP_ID: 2554,
      KEY1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
      ENDPOINT: "https://sb-openapi.zalopay.vn/v2/create",
    };

    // --- TẠO app_trans_id ĐÚNG CHUẨN ---
    const date = new Date();
    const yy = date.getFullYear().toString().slice(2);
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");

    // Format chuẩn: YYMMDD_randomNumber
    const randomNumber = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${yy}${mm}${dd}_${randomNumber}`;

    // --- app_time = timestamp hiện tại ---
    const app_time = Date.now();

    // --- embed_data đúng chuẩn JSON ---
    const embed_data = JSON.stringify({
      redirecturl: "http://localhost:3000/payment/zalopay-result",
      // ❗ Bạn đổi sang URL ngrok thật
      ipn_url: "https://your-ngrok-url.ngrok-free.app/payment/zalopay-ipn",
    });

    const item = JSON.stringify([
      {
        itemid: "ITEM_1",
        itemname: "Thanh toán đơn hàng",
        itemprice: amount,
      },
    ]);

    // --- Build params chuẩn ---
    const orderParams = {
      app_id: ZALO_CONFIG.APP_ID,
      app_trans_id,
      app_user: "user_test",
      app_time,
      amount,
      embed_data,
      item,
      description: `Thanh toan don hang #${orderId}`,
      bank_code: "",
    };

    // --- TẠO MAC CHUẨN ---
    const dataToHash = [
      orderParams.app_id,
      orderParams.app_trans_id,
      orderParams.app_user,
      orderParams.amount,
      orderParams.app_time,
      orderParams.embed_data,
      orderParams.item,
    ].join("|");

    orderParams.mac = crypto
      .createHmac("sha256", ZALO_CONFIG.KEY1)
      .update(dataToHash)
      .digest("hex");

    console.log("👉 [Backend] Gửi lên ZaloPay:", orderParams);

    // --- GỬI YÊU CẦU TỚI ZALOPAY ---
    const result = await axios.post(ZALO_CONFIG.ENDPOINT, null, {
      params: orderParams,
    });

    console.log("👈 [Backend] Phản hồi ZaloPay:", result.data);

    if (result.data.return_code === 1) {
      return res.json({
        order_url: result.data.order_url,
        app_trans_id,
        message: "Tạo đơn thanh toán thành công",
      });
    }

    return res.status(400).json({
      message: "ZaloPay từ chối yêu cầu",
      details: result.data,
    });
  } catch (error) {
    console.error("❌ [Backend] Lỗi hệ thống:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
});

// --- CALLBACK ZALOPAY ---
router.get("/zalopay-result", async (req, res) => {
  const { apptransid, status } = req.query;

  console.log("📥 ZaloPay result:", req.query);

  if (apptransid && status && Number(status) !== 1) {
    try {
      const parts = apptransid.split("_");
      const orderId = parts[1] ? Number(parts[1]) : null;

      if (orderId) {
        const Order = (await import("../models/order.model.js")).Order;
        await Order.update(
          { status: "cancelled" },
          { where: { order_id: orderId } }
        );
        console.log(`❗ Đơn ${orderId} bị hủy hoặc thanh toán lỗi.`);
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật đơn:", err);
    }
  }

  res.json({ success: true });
});

export default router;
