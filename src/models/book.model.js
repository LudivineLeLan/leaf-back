import { DataTypes, Model } from "sequelize";
import { sequelize } from './sequelize.client.js';


export class Book extends Model {}

Book.init(
  {
    googleBooksId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cover: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    serieId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'books',
    underscored: true
  }
);
