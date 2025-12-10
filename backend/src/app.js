import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

// ----------------- IMPORT MODELS -----------------
import "./models/product_models.js";
import "./models/category_models.js";
import "./models/product_category_models.js";
import { sequelize } from "./config/db.js";

// ----------------- IMPORT ROUTES -----------------
import productRoutes from "./routes/product_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import authRoutes from "./routes/auth_routes.js";
import profileRoutes from "./routes/profile_routes.js";
import cartRoutes from "./routes/cart_routes.js";
import orderRoutes from "./routes/order_routes.js";
import paymentRouter from "./routes/payment_routes.js";
import adminStatsRouter from "./routes/adminStats.js"
import reviewRouter from "./routes/review.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------- MIDDLEWARE -----------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------- STATIC FILES -----------------
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ----------------- ROUTES -----------------
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRouter);
app.use('/admin', adminStatsRouter);
app.use("/api/reviews", reviewRouter);

// ----------------- TEST ROUTE -----------------
app.get("/", (req, res) => {
  res.send("✅ API is running!");
});

// ----------------- START SERVER & SYNC DB -----------------
const PORT = process.env.PORT || 3001;

const syncDatabase = async () => {
  try {
    // CHỈ SYNC — KHÔNG ALTER
    await sequelize.sync(); 

    console.log("✅ Database synced successfully");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to sync database:", err);
  }
};


syncDatabase();

export default app;
