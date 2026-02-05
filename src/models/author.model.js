import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Author extends Model { }

Author.init(
   {
      name: {
         type: DataTypes.STRING(100),
         allowNull: false,
      },
      firstname: {
         type: DataTypes.STRING(100),
         allowNull: false,
      },
      bio: {
         type: DataTypes.STRING(500),
         allowNull: false,
      }
   },
   {
      sequelize,
      tableName: "authors",
   }
);