import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";


export class Genre extends Model {}

Genre.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'genres',
    underscored: true,
    timestamps: false
  }
);
