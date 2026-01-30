import { DataTypes, Model } from "sequelize";
import { sequelize } from './sequelize.client.js';


export class UserSerie extends Model { }


UserSerie.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  serieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'series', key: 'id' }
  },
  currentVolume: {
    type: DataTypes.INTEGER,
    defaultValue: 0 
  }, 
  readingStatus: {
    type: DataTypes.ENUM('to_read', 'reading', 'finished', 'dropped'),
    defaultValue: 'to_read'
  }
}, {
  sequelize,
  tableName: 'user_series',
  underscored: true 
});