import { Author } from "./author.model";
import { Book } from "./book.model";
import { Genre } from "./genre.model";
import { Serie } from "./serie.model";
import { User} from "./user.model";
import { UserBook } from "./userBook.model";
import { UserSerie } from "./userSerie.model";
import { Sequelize } from "sequelize";

// USER <-> BOOK 
User.belongsToMany(Book, { 
  through: UserBook, 
  foreignKey: "user_id", 
  as: "books" 
});

Book.belongsToMany(User, { 
  through: UserBook, 
  foreignKey: "book_id", 
  as: "users" 
});

// Progression de lecture
User.hasMany(UserBook, { 
  foreignKey: 'user_id', 
  as: 'userBooks' 
});

UserBook.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

Book.hasMany(UserBook, { 
  foreignKey: "book_id", 
  as: "userBooks" 
});

UserBook.belongsTo(Book, { 
  foreignKey: "book_id", 
  as: "book" 
});

// SERIE <-> BOOK
Serie.hasMany(Book, { 
  foreignKey: 'serie_id', 
  as: 'books' 
});

Book.belongsTo(Serie, { 
  foreignKey: 'serie_id', 
  as: 'serie' 
});

// GENRE, SERIE, BOOK
Genre.belongsToMany(Serie, { 
  through: 'serie_genres', 
  foreignKey: 'genre_id', as: 'series' 
});

Serie.belongsToMany(Genre, { 
  through: 'serie_genres', 
  foreignKey: 'serie_id', as: 'genres' 
});

Genre.belongsToMany(Book, { 
  through: 'book_genres', 
  foreignKey: 'genre_id', as: 'books' 
});

Book.belongsToMany(Genre, { 
  through: 'book_genres', 
  foreignKey: 'book_id', 
  as: 'genres' 
});

// AUTHOR, SERIES, BOOK
Author.belongsToMany(Serie, { 
  through: 'serie_authors', 
  foreignKey: 'author_id', 
  as: 'series' 
});

Serie.belongsToMany(Author, { 
  through: 'serie_authors', 
  foreignKey: 'serie_id', 
  as: 'authors' 
});

Author.belongsToMany(Book, { 
  through: 'book_authors', 
  foreignKey: 'author_id', 
  as: 'books' 
});

Book.belongsToMany(Author, { 
  through: 'book_authors', 
  foreignKey: 'book_id', 
  as: 'authors' 
});

// USER <-> SERIE
User.belongsToMany(Serie, { 
  through: UserSerie, 
  foreignKey: 'user_id', 
  as: 'series' 
});

Serie.belongsToMany(User, { 
  through: UserSerie, 
  foreignKey: 'serie_id', 
  as: 'users' 
});

User.hasMany(UserSerie, { 
  foreignKey: 'user_id',
  as: 'userSeries' 
});

UserSerie.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

export { User, Book, Author, Genre, Serie, UserBook, UserSerie, Sequelize };