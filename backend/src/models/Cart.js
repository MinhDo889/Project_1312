import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    timestamps: false,
  }
);

export default Cart;
