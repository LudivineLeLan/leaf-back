import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.client.js';

export class SerieGenre extends Model {}

SerieGenre.init(
  {
    serieId: {
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
    tableName: 'series_genres',
    underscored: true,
    timestamps: false
  }
);
