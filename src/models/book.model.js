import { DataTypes, Model } from "sequelize";
import { sequelize } from './sequelize.client.js';


export class Book extends Model { }


Book.init({

google_books_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
   },

   title: {
      type: DataTypes.STRING(255),
      allowNull: false
   },

   author: {
      type: DataTypes.STRING(255),
      allowNull: false
},

   release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
   },
   
   cover: {
      type: DataTypes.TEXT, //URL API
      allowNull: false,
   },

   synopsis: {
      type: DataTypes.TEXT,
      allowNull: true
   }
}, {
   sequelize,
   tableName: 'books',
   underscored: true
});