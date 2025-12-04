import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user_models.js"; // giả sử bạn đã có model User

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: false,
  }
);

// Relation với User
Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Order;
