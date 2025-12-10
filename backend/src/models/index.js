import User from "./user_models.js";
import Cart from "./Cart.js";
import CartItem from "./Cart_item.js";
import Product from "./product_models.js";
import Category from "./category_models.js";
import Order from "./order_models.js";
import Review from "./reviews_model.js";

// ==========================
// RELATIONS
// ==========================

// USER ↔ CART (1-1)
User.hasOne(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// CART ↔ CART ITEMS (1-n)
Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// PRODUCT ↔ CART ITEMS (1-n)
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// USER ↔ ORDER (1-n)
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });
// trong models/index.js hoặc model setup
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

// EXPORT ALL MODELS
export { User, Cart, CartItem, Product, Category, Order, Review };
