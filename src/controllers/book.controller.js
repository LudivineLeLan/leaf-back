import GoogleBooksService from "../services/GoogleBooksService.js";
import { UserBook, Book } from "../models/index.js";

export const bookController = {
	// Recherche catalogue Google
	async search(req, res) {
		try {
			const { q } = req.query;

			if (!q || q.trim().length < 2) return res.json([]);

			const booksFromGoogle = await GoogleBooksService.search(q.trim());

			// Si utilisateur connecté, récupérer ses livres déjà présents
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

	// Détail catalogue Google
	async getByGoogleId(req, res) {
		try {
			const { googleId } = req.params;
			const book = await GoogleBooksService.getById(googleId);

			// Vérifier si le livre est déjà dans la bibliothèque de utilisateur connecté
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
};
