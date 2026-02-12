import { UserBook, Book, Author, Genre } from "../models/index.js";
import { Op } from "sequelize";

export const userBookController = {
	// Recherche dans la bibliothèque du user
	async search(req, res) {
		try {
			const { q } = req.query;

			if (!q || q.trim().length < 2) return res.json([]);

			const searchTerm = q.trim();
			const words = searchTerm.split(/\s+/);

			// Création de toutes les conditions possibles
			const authorConditions = words.flatMap((word) => [
				{ "$book.authors.name$": { [Op.iLike]: `%${word}%` } },
				{ "$book.authors.firstname$": { [Op.iLike]: `%${word}%` } },
			]);

			const genreConditions = words.map((word) => ({
				"$book.genres.name$": { [Op.iLike]: `%${word}%` },
			}));

			const results = await UserBook.findAll({
				where: { userId: req.user.id },
				include: [
					{
						model: Book,
						as: "book",
						required: true,
						include: [
							{
								model: Author,
								as: "authors",
								through: { attributes: [] },
								required: false,
							},
							{
								model: Genre,
								as: "genres",
								through: { attributes: [] },
								required: false,
							},
						],
					},
				],
				limit: 10,
				// where sur la requête finale pour inclure tous les critères
				subQuery: false,
				order: [["book", "title", "ASC"]],
				// where principal combine titre, auteurs et genres
				where: {
					[Op.or]: [
						{ "$book.title$": { [Op.iLike]: `%${searchTerm}%` } },
						...authorConditions,
						...genreConditions,
					],
				},
			});

			res.json(results);
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ error: "Erreur de recherche dans la bibliothèque" });
		}
	},

	// Détails d'un livre
	async getDetails(req, res) {
		try {
			const userBook = await UserBook.findOne({
				where: { id: req.params.id, userId: req.user.id },
				include: {
					model: Book,
					as: "book",
					include: [
						{ model: Author, as: "authors", through: { attributes: [] } },
						{ model: Genre, as: "genres", through: { attributes: [] } },
					],
				},
			});

			if (!userBook)
				return res
					.status(404)
					.json({ error: "Livre non trouvé dans votre bibliothèque" });

			res.json(userBook);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erreur serveur" });
		}
	},

	// ajout d'un livre dans la bibliothèque

	async addBookToUserList(req, res) {
		try {
			const userId = req.user.id;
			const { bookId } = req.params;
			const { status = "to_read" } = req.body;

			if (!bookId) {
				return res.status(400).json({ message: "bookId requis" });
			}

			const book = await Book.findByPk(bookId);
			if (!book) {
				return res.status(404).json({ message: "Livre non trouvé." });
			}

			const existingEntry = await UserBook.findOne({
				where: { userId, bookId },
			});

			if (existingEntry) {
				return res.status(400).json({
					message: "Ce livre est déjà dans votre bibliothèque.",
				});
			}

			const userBook = await UserBook.create({
				userId,
				bookId,
				status, // exemple : to_read | reading | finished
			});

			return res.status(201).json(userBook);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async updateReadStatus(req, res) {
		try {
			const { userId, bookId } = req.params;
			const { toRead } = req.body;

			if (!userId || !bookId) {
				return res
					.status(400)
					.json({ message: "userId et bookId sont requis" });
			}

			if (typeof toRead !== "boolean") {
				return res.status(400).json({ message: "toRead doit être un booléen" });
			}

			const userBook = await UserBook.findOne({
				where: {
					user_id: userId,
					book_id: bookId,
				},
			});

			if (!userBook) {
				return res.status(404).json({
					message: "Livre non trouvé dans la booklist de l'utilisateur.",
				});
			}

			userBook.toRead = toRead;
			await userBook.save();

			return res.status(200).json({
				message: "Statut de lecture mis à jour avec succès.",
				data: userBook,
			});
		} catch (error) {
			return res.status(500).json({
				error: "Erreur serveur",
				message: error.message,
			});
		}
	},
};
