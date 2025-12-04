import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user_models.js";

class Profile extends Model {}

Profile.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE", // Xóa profile nếu user bị xóa
    },

    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null, // Link ảnh (sẽ lưu đường dẫn ảnh upload)
    },

    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Vietnam",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: false,
  }
);

// ======================
// 🔗 Thiết lập quan hệ
// ======================
User.hasOne(Profile, {
  foreignKey: "user_id",
  as: "profile",
});

Profile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export default Profile;
