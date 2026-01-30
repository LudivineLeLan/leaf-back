import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Users extends Model { }


Users.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: false,
    },
    age: {
      type: DataTypes.INTEGER,

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);