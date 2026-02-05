import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.client.js';

export class BookGenre extends Model {}

BookGenre.init(
  {
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    sequelize,
    tableName: 'book_genres',
    underscored: true,
    timestamps: false
  }
);
