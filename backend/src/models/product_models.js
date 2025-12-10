import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user_models.js"; // Người tạo sản phẩm
import Category from "./category_models.js"; // Danh mục sản phẩm (sẽ tạo model này riêng bên dưới)

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    skin_type: {
      type: DataTypes.ENUM("da_dau", "da_kho", "hon_hop", "nhay_cam", "tat_ca"),
      defaultValue: "tat_ca",
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
    
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  }
);

export default Product;
