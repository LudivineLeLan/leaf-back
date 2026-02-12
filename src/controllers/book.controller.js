import googleBooksService from "../services/googlebooksservice.js";

export const bookController = {
	// Recherche catalogue Google
	async search(req, res) {
		try {
			const { q } = req.query;

			if (!q || q.trim().length < 2) {
				return res.json([]);
			}

			const books = await googleBooksService.search(q.trim());
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

			const book = await googleBooksService.getById(googleId);
			res.json(book);
		} catch (error) {
			console.error(error);
			res.status(404).json({ error: "Livre non trouvé" });
		}
	},
};
