import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.client.js';

export class SerieAuthor extends Model {}

SerieAuthor.init(
  {
    serieId: {
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
    tableName: 'series_authors',
    underscored: true,
    timestamps: false
  }
);
