import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.client.js';

export class UserBook extends Model {}

UserBook.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('to_read', 'reading', 'finished'),
      allowNull: false,
      defaultValue: 'to_read'
    }
  },
  {
    sequelize,
    tableName: 'user_books',
    underscored: true,
    timestamps: false
  }
);
