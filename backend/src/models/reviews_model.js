import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // đảm bảo bạn import sequelize instance
import User from "./user_models.js";
import Product from "./product_models.js";

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true, // sửa từ primaKey -> primaryKey
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.CHAR(36), // sửa Datatypes -> DataTypes
      allowNull: false,
      references: {
        model: User,
        key: "id", // sửa Key -> key
      },
    },
    product_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize, // cần khai báo sequelize instance
    modelName: "Review",
    tableName: "reviews",
    timestamps: true,
  }
);

export default Review;
