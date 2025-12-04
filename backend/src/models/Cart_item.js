import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class CartItem extends Model {}

CartItem.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    cart_id: {
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
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: false,
  }
);

export default CartItem;
