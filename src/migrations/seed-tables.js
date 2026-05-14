import { sequelize } from "../models/sequelize.client.js";
import argon2 from "argon2";

import { User } from "../models/user.model.js";
import { Author } from "../models/author.model.js";
import { Book } from "../models/book.model.js";
import { BookAuthor } from "../models/bookAuthor.models.js";
import { Genre } from "../models/genre.model.js";
import { BookGenre } from "../models/bookGenre.model.js";
import { Serie } from "../models/serie.model.js";
import { SerieAuthor } from "../models/serieAuthor.model.js";
import { SerieGenre } from "../models/serieGenre.model.js";
import { UserBook } from "../models/userBook.model.js";
import { UserSerie } from "../models/userSerie.model.js";

async function seed() {
	try {
		console.log("🌱 Seeding des tables...");
		await sequelize.authenticate();
		console.log("Connexion à la DB réussie");

		const hashedPassword1 = await argon2.hash("password123");
		const hashedPassword2 = await argon2.hash("password123");

		//  USERS
		const users = await User.bulkCreate(
			[
				{
					username: "Ludivine",
					email: "ludivine@test.com",
					password: hashedPassword1,
				},
				{
					username: "Alex",
					email: "alex@test.com",
					password: hashedPassword2,
				},
			],
			{ ignoreDuplicates: true },
		);

		// AUTHORS
		const authors = await Author.bulkCreate(
			[
				{ name: "Rowling", firstname: "J.K.", bio: "Auteur de Harry Potter" },
				{
					name: "Tolkien",
					firstname: "J.R.R.",
					bio: "Auteur du Seigneur des Anneaux",
				},
			],
			{ ignoreDuplicates: true },
		);

		// GENRES
		const genres = await Genre.bulkCreate(
			[{ name: "Fantasy" }, { name: "Science Fiction" }, { name: "Manga" }],
			{ ignoreDuplicates: true },
		);

		// SERIES
		const series = await Serie.bulkCreate(
			[
				{
					name: "Harry Potter",
					description: "Saga magique",
					type: "novel",
					total_volumes: 7,
				},
				{
					name: "Le Seigneur des Anneaux",
					description: "Épopée fantastique",
					type: "novel",
					total_volumes: 3,
				},
			],
			{ ignoreDuplicates: true },
		);

		// BOOKS
		const books = await Book.bulkCreate(
			[
				{
					googleBooksId: "1HP",
					title: "Harry Potter à l'école des sorciers",
					cover: "hp1.jpg",
					serieId: 1,
				},
				{
					googleBooksId: "2HP",
					title: "Harry Potter et la Chambre des Secrets",
					cover: "hp2.jpg",
					serieId: 1,
				},
				{
					googleBooksId: "1LOTR",
					title: "La Communauté de l'Anneau",
					cover: "lotr1.jpg",
					serieId: 2,
				},
			],
			{ ignoreDuplicates: true },
		);

		// BOOK-AUTHOR RELATIONS
		await BookAuthor.bulkCreate(
			[
				{ bookId: 1, authorId: 1 },
				{ bookId: 2, authorId: 1 },
				{ bookId: 3, authorId: 2 },
			],
			{ ignoreDuplicates: true },
		);

		// BOOK-GENRE RELATIONS
		await BookGenre.bulkCreate(
			[
				{ bookId: 1, genreId: 1 },
				{ bookId: 2, genreId: 1 },
				{ bookId: 3, genreId: 1 },
			],
			{ ignoreDuplicates: true },
		);

		// SERIE-AUTHOR RELATIONS
		await SerieAuthor.bulkCreate(
			[
				{ serieId: 1, authorId: 1 },
				{ serieId: 2, authorId: 2 },
			],
			{ ignoreDuplicates: true },
		);

		// SERIE-GENRE RELATIONS
		await SerieGenre.bulkCreate(
			[
				{ serieId: 1, genreId: 1 },
				{ serieId: 2, genreId: 1 },
			],
			{ ignoreDuplicates: true },
		);

		// USER-BOOK RELATIONS
		await UserBook.bulkCreate(
			[
				{ userId: 1, bookId: 1, status: "reading" },
				{ userId: 1, bookId: 3, status: "to_read" },
			],
			{ ignoreDuplicates: true },
		);

		// USER-SERIE RELATIONS
		await UserSerie.bulkCreate(
			[
				{ userId: 1, serieId: 1, currentVolume: 1, readingStatus: "reading" },
				{ userId: 2, serieId: 2, currentVolume: 0, readingStatus: "to_read" },
			],
			{ ignoreDuplicates: true },
		);

		console.log("✅ Seeding terminé avec succès !");
		await sequelize.close();
	} catch (err) {
		console.error("Erreur lors du seeding :", err);
		await sequelize.close();
	}
}

seed();
