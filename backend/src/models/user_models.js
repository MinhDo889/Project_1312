import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class User extends Model {}

User.init(
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("super_admin", "admin", "user"),
      defaultValue: "user",
    },
    skin_type: {
      type: DataTypes.ENUM("da_dau", "da_kho", "hon_hop", "nhay_cam", "tat_ca"),
      defaultValue: "tat_ca",
    },
    verification_code: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: false }
);

export default User;
