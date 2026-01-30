import { DataTypes, Model } from "sequelize";
import { sequelize } from './sequelize.client.js';


export class Book extends Model { }


Book.init({
id: {
      type: DataTypes.STRING(255),
      allowNull: false
   },

google_books_id: {
      type: DataTypes.STRING(255),
      allowNull: false
   },

   title: {
      type: DataTypes.STRING(255),
      allowNull: false
   },

   author: {
      name: DataTypes.STRING(255),
      lastname: DataTypes.STRING(255),
},

   release_date: {
      type: DataTypes.DATE,
      allowNull: true
   },
   cover: {

      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
         len: [0, 255],
      }
   },
   synopsis: {
      type: DataTypes.STRING(800),
      allowNull: false
   }
}, {
   sequelize,
   tableName: 'books',
   underscored: true
});