import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./product_models.js";
import Category from "./category_models.js";

class ProductCategory extends Model {}

ProductCategory.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    product_id: {
      type: DataTypes.CHAR(36),
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.CHAR(36),
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "ProductCategory",
    tableName: "product_categories",
    timestamps: false,
  }
);

// =====================
// 🔗 Thiết lập quan hệ
// =====================
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "category_id",
  otherKey: "product_id",
  as: "products",
});

export default ProductCategory;
