import { Author, Book, UserBook } from "../models/index.js";
import GoogleBooksService from "../services/GoogleBooksService.js";

export const authorController = {
	async getAllAuthors(req, res) {
		try {
			const authors = await Author.findAll({});
			res.json(authors);
		} catch (error) {
			res
				.status(500)
				.json({ error: "Erreur lors de la récupération des auteurs" });
		}
	},

	async getAuthorById(req, res) {
		try {
			const { authorId } = req.params;

			const author = await Author.findByPk(authorId);
			if (!author) return res.status(404).json({ message: "Author not found" });

			const fullName = `${author.firstname || ""} ${author.name}`.trim();

			// Search Google Books by author name
			const googleResults = await GoogleBooksService.search(fullName, 40);

			// Deduplicate to delete doubles
			const seen = new Set(); //set contains only unique values
			const uniqueResults = googleResults.filter((book) => {
				if (seen.has(book.googleBooksId)) return false;
				seen.add(book.googleBooksId);
				return true;
			});

			// Check if books are in user library
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

			const books = uniqueResults
				.filter((book) =>
					book.authors?.some(
						//some = check if at least one element in array matches the condition
						(author) =>
							author.toLowerCase().includes(fullName.toLowerCase()) ||
							fullName.toLowerCase().includes(author.toLowerCase()),
					),
				)
				.map((book) => ({
					googleBooksId: book.googleBooksId,
					title: book.title,
					cover: book.thumbnail,
					publishedDate: book.publishedDate,
					isInLibrary: libraryGoogleIds.includes(book.googleBooksId),
				}));

			return res.json({
				id: author.id,
				name: author.name,
				firstname: author.firstname,
				books,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},
};
