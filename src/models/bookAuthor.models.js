import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.client.js';

export class BookAuthor extends Model {}

BookAuthor.init(
  {
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    sequelize,
    tableName: 'book_authors',
    underscored: true,
    timestamps: false
  }
);
