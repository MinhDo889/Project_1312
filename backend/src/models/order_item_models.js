import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import Order from "./order_models.js";
import Product from "./product_models.js"; // giả sử bạn đã có model Product

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: false,
  }
);

// Relation với Order
OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
// Relation với Product
OrderItem.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relation 1-N: Order -> OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id" });

export default OrderItem;
