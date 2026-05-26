import GoogleBooksService from "../services/GoogleBooksService.js";
import { attachSerieToBook } from "../services/series.service.js";
import { UserBook, Book, Author, BookAuthor, Serie } from "../models/index.js";

export const bookController = {
	// Search in Google catalog
	async search(req, res) {
		try {
			const { q } = req.query;

			if (!q || q.trim().length < 2) return res.json([]);

			const booksFromGoogle = await GoogleBooksService.search(q.trim());

			// If user already logged, get library books
			let libraryGoogleIds = [];
			if (req.user) {
				const userBooks = await UserBook.findAll({
					where: { userId: req.user.id },
					include: {
						model: Book,
						as: "book",
						attributes: ["googleBooksId"],
					},
				});

				libraryGoogleIds = userBooks.map(
					(userBook) => userBook.book.googleBooksId,
				);
			}

			const books = booksFromGoogle.map((book) => ({
				...book,
				isInLibrary: libraryGoogleIds.includes(book.googleBooksId),
			}));

			res.json(books);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erreur lors de la recherche de livres" });
		}
	},

	// Google catalog book details
	async getByGoogleId(req, res) {
		try {
			const { googleId } = req.params;
			const book = await GoogleBooksService.getById(googleId);

			// Check if book already in user library
			if (req.user) {
				const userBook = await UserBook.findOne({
					where: { userId: req.user.id },
					include: {
						model: Book,
						as: "book",
						where: { googleBooksId: googleId },
						attributes: ["googleBooksId"],
					},
				});

				book.isInLibrary = !!userBook;
			} else {
				book.isInLibrary = false;
			}

			res.json(book);
		} catch (error) {
			console.error(error);
			res.status(404).json({ error: "Livre non trouvé" });
		}
	},

	async importBook(req, res) {
		try {
			const { googleBooksId, title, authors, thumbnail } = req.body;

			if (!googleBooksId) {
				return res.status(400).json({ message: "googleBooksId requis" });
			}

			const googleData = await GoogleBooksService.getById(googleBooksId);

			const [book, created] = await Book.findOrCreate({
				where: { googleBooksId },
				defaults: {
					title: googleData.title || title,
					googleBooksId,
					cover: googleData.thumbnail || thumbnail || null,
					synopsis: googleData.description || null,
					releaseDate: googleData.publishedDate || null,
					seriesDetected: googleData.seriesDetected || false,
					seriesPosition: googleData.seriesPosition || null,
				},
			});

			if (created) {
				try {
					await attachSerieToBook(book);
				} catch (err) {
					console.error("Erreur attachSerieToBook :", err.message);
				}

				// Create authors
				if (googleData.authors?.length > 0) {
					for (const authorName of googleData.authors) {
						const parts = authorName.trim().split(" ");
						const firstname = parts.slice(0, -1).join(" ") || authorName;
						const name = parts.length > 1 ? parts[parts.length - 1] : "";

						const [author] = await Author.findOrCreate({
							where: { name, firstname },
							defaults: { name, firstname },
						});

						await BookAuthor.findOrCreate({
							where: { bookId: book.id, authorId: author.id },
						});
					}
				}
			}

			await book.reload();

			return res.status(created ? 201 : 200).json(book);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async getBookById(req, res) {
		try {
			const { bookId } = req.params;

			const book = await Book.findByPk(bookId, {
				include: [
					{ model: Author, as: "authors", through: { attributes: [] } },
					{ model: Serie, as: "serie" },
				],
			});

			if (!book) {
				return res.status(404).json({ error: "Livre non trouvé" });
			}

			let isInLibrary = false;
			let userStatus = null;

			if (req.user) {
				const userBook = await UserBook.findOne({
					where: { userId: req.user.id, bookId },
				});
				isInLibrary = !!userBook;
				userStatus = userBook?.status || null;
			}

			return res.json({ ...book.toJSON(), isInLibrary, userStatus });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Erreur serveur" });
		}
	},
};
