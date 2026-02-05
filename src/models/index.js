import { Author } from './author.model.js';
import { Book } from './book.model.js';
import { Genre } from './genre.model.js';
import { Serie } from './serie.model.js';
import { User } from './user.model.js';
import { UserBook } from './userBook.model.js';
import { UserSerie } from './userSerie.model.js';
import { BookAuthor } from './bookAuthor.models.js';
import { BookGenre } from './bookGenre.model.js';
import { SerieAuthor } from './serieAuthor.model.js';
import { SerieGenre } from './serieGenre.model.js';
import { sequelize } from './sequelize.client.js';

/*
   USER <-> BOOK
*/

User.belongsToMany(Book, {
  through: UserBook,
  foreignKey: 'userId',
  as: 'books'
});

Book.belongsToMany(User, {
  through: UserBook,
  foreignKey: 'bookId',
  as: 'users'
});

User.hasMany(UserBook, {
  foreignKey: 'userId',
  as: 'userBooks'
});

UserBook.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Book.hasMany(UserBook, {
  foreignKey: 'bookId',
  as: 'userBooks'
});

UserBook.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

/*
   SERIE <-> BOOK
*/

Serie.hasMany(Book, {
  foreignKey: 'serieId',
  as: 'books'
});

Book.belongsTo(Serie, {
  foreignKey: 'serieId',
  as: 'serie'
});

/*
   GENRE <-> SERIE
*/

Genre.belongsToMany(Serie, {
  through: SerieGenre,
  foreignKey: 'genreId',
  as: 'series'
});

Serie.belongsToMany(Genre, {
  through: SerieGenre,
  foreignKey: 'serieId',
  as: 'genres'
});

/*
   GENRE <-> BOOK
*/

Genre.belongsToMany(Book, {
  through: BookGenre,
  foreignKey: 'genreId',
  as: 'books'
});

Book.belongsToMany(Genre, {
  through: BookGenre,
  foreignKey: 'bookId',
  as: 'genres'
});

/*
   AUTHOR <-> SERIE
*/

Author.belongsToMany(Serie, {
  through: SerieAuthor,
  foreignKey: 'authorId',
  as: 'series'
});

Serie.belongsToMany(Author, {
  through: SerieAuthor,
  foreignKey: 'serieId',
  as: 'authors'
});

/*
   AUTHOR <-> BOOK
*/

Author.belongsToMany(Book, {
  through: BookAuthor,
  foreignKey: 'authorId',
  as: 'books'
});

Book.belongsToMany(Author, {
  through: BookAuthor,
  foreignKey: 'bookId',
  as: 'authors'
});

/* 
   USER <-> SERIE
*/

User.belongsToMany(Serie, {
  through: UserSerie,
  foreignKey: 'userId',
  as: 'series'
});

Serie.belongsToMany(User, {
  through: UserSerie,
  foreignKey: 'serieId',
  as: 'users'
});

User.hasMany(UserSerie, {
  foreignKey: 'userId',
  as: 'userSeries'
});

UserSerie.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export {
  User,
  Book,
  Author,
  Genre,
  Serie,
  UserBook,
  UserSerie,
  sequelize
};
