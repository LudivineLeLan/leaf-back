import { UserBook, Book, Author, Genre, Serie } from "../models/index.js";
import { Op } from "sequelize";
import { attachSerieToBook } from "../services/series.service.js";

export const userBookController = {
	// Search in user's library
	async search(req, res) {
		try {
			const { q } = req.query;
			if (!q || q.trim().length < 2) return res.json([]);

			const searchTerm = q.trim();
			const words = searchTerm.split(/\s+/);

			const authorConditions = words.flatMap((word) => [
				{ "$book.authors.name$": { [Op.iLike]: `%${word}%` } },
				{ "$book.authors.firstname$": { [Op.iLike]: `%${word}%` } },
			]);

			const genreConditions = words.map((word) => ({
				"$book.genres.name$": { [Op.iLike]: `%${word}%` },
			}));

			const results = await UserBook.findAll({
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
							{
								model: Serie,
								as: "serie",
							},
						],
					},
				],
				limit: 10,
				subQuery: false,
				order: [["book", "title", "ASC"]],
				where: {
					[Op.and]: [
						{ userId: req.user.id },
						{
							[Op.or]: [
								{ "$book.title$": { [Op.iLike]: `%${searchTerm}%` } },
								...authorConditions,
								...genreConditions,
							],
						},
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

	// Book details
	async getDetails(req, res) {
		try {
			const userBook = await UserBook.findOne({
				where: { userId: req.user.id, bookId: req.params.bookId },
				include: {
					model: Book,
					as: "book",
					include: [
						{ model: Author, as: "authors", through: { attributes: [] } },
						{ model: Genre, as: "genres", through: { attributes: [] } },
						{ model: Serie, as: "serie" },
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

	// Add book to library
	async addBookToUserList(req, res) {
		try {
			const userId = req.user.id;
			const { bookId } = req.params;
			const { status = "to_read" } = req.body;

			if (!bookId) return res.status(400).json({ message: "bookId requis" });

			const book = await Book.findByPk(bookId);
			if (!book) return res.status(404).json({ message: "Livre non trouvé." });

			const existingEntry = await UserBook.findOne({
				where: { userId, bookId },
			});
			if (existingEntry)
				return res
					.status(400)
					.json({ message: "Ce livre est déjà dans votre bibliothèque." });

			const userBook = await UserBook.create({ userId, bookId, status });

			return res.status(201).json(userBook);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// Update reading status
	async updateReadStatus(req, res) {
		try {
			const userId = req.user.id;
			const { bookId } = req.params;
			const { status } = req.body; // to_read | reading | finished

			if (!status || !["to_read", "reading", "finished"].includes(status)) {
				return res.status(400).json({ message: "Statut invalide" });
			}

			const userBook = await UserBook.findOne({ where: { userId, bookId } });
			if (!userBook)
				return res
					.status(404)
					.json({ message: "Livre non trouvé dans votre bibliothèque." });

			userBook.status = status;
			await userBook.save();

			return res
				.status(200)
				.json({ message: "Statut mis à jour.", data: userBook });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// Delete book from library
	async removeBookFromUserList(req, res) {
		try {
			const userId = req.user.id;
			const { bookId } = req.params;

			const deleted = await UserBook.destroy({
				where: { userId, bookId },
			});

			if (!deleted)
				return res
					.status(404)
					.json({ message: "Livre non trouvé dans votre bibliothèque." });

			return res
				.status(200)
				.json({ message: "Livre supprimé de votre bibliothèque." });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	// Show library
	async getLibrary(req, res) {
		try {
			const userBooks = await UserBook.findAll({
				where: { userId: req.user.id },
				include: [
					{
						model: Book,
						as: "book",
						include: [
							{
								model: Serie,
								as: "serie",
							},
						],
					},
				],
				order: [["bookId", "DESC"]],
			});

			res.json(userBooks);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erreur serveur" });
		}
	},

	async getLibraryOverview(req, res) {
		try {
			const userId = req.user.id;

			const userBooks = await UserBook.findAll({
				where: { userId },
				include: [
					{
						model: Book,
						as: "book",
						include: [{ model: Serie, as: "serie" }],
					},
				],
			});

			// Group by serie
			const seriesMap = new Map();
			const standalone = [];

			for (const userBook of userBooks) {
				const book = userBook.book;
				if (!book) continue;

				if (book.serie) {
					if (!seriesMap.has(book.serie.id)) {
						seriesMap.set(book.serie.id, {
							id: book.serie.id,
							name: book.serie.name,
							total_volumes: book.serie.total_volumes,
							cover: null,
							booksOwned: 0,
							books: [],
						});
					}
					const serieData = seriesMap.get(book.serie.id);
					serieData.booksOwned += 1;
					serieData.books.push({
						id: book.id,
						title: book.title,
						cover: book.cover,
						seriesPosition: book.seriesPosition,
						status: userBook.status,
					});
					// Use cover of first tome
					if (!serieData.cover && book.cover) {
						serieData.cover = book.cover;
					}
				} else {
					standalone.push({
						id: book.id,
						title: book.title,
						cover: book.cover,
						status: userBook.status,
					});
				}
			}

			return res.json({
				series: Array.from(seriesMap.values()),
				standalone,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},
};
