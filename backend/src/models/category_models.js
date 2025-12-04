import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);

export default Category;
