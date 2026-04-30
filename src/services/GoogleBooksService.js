class GoogleBooksService {
	constructor() {
		this.baseURL = "https://www.googleapis.com/books/v1/volumes";
	}

	/**
	 * Recherche des livres
	 * @param {string} query - Terme de recherche
	 * @param {number} maxResults - Nombre max de résultats (défaut: 10)
	 * @returns {Promise<Array>} - Liste des livres trouvés
	 */
	async search(query, maxResults = 10) {
		try {
			// Construction de la requête de recherche
			const searchQuery = `intitle:${encodeURIComponent(query)}`;
			const url = `${this.baseURL}?q=${searchQuery}&maxResults=${maxResults}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Google Books API error: ${response.status}`);
			}

			const data = await response.json();

			// Retourne un tableau vide si pas de résultats
			if (!data.items || data.items.length === 0) {
				return [];
			}

			// Formate les résultats pour ne garder que l'essentiel
			return data.items.map((book) => this.formatBook(book));
		} catch (error) {
			console.error("Error searching books:", error.message);
			throw error;
		}
	}

	/**
	 * Récupère les détails d'un livre par son ID Google Books
	 * @param {string} googleBooksId - ID du livre sur Google Books
	 * @returns {Promise<Object>} - Détails du livre
	 */
	async getById(googleBooksId) {
		try {
			const url = `${this.baseURL}/${googleBooksId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Book not found: ${googleBooksId}`);
			}

			const data = await response.json();
			return this.formatBook(data);
		} catch (error) {
			console.error("Error fetching book by ID:", error.message);
			throw error;
		}
	}

	/**
	 * Formate un livre pour ne garder que les infos utiles
	 * @param {Object} book - Livre brut de l'API
	 * @returns {Object} - Livre formaté
	 */
	formatBook(book) {
		const info = book.volumeInfo || {};

		return {
			googleBooksId: book.id,
			title: info.title || "Titre inconnu",
			authors: info.authors || [],
			publishedDate: info.publishedDate || null,
			description: info.description || null,
			thumbnail: info.imageLinks?.thumbnail || null,
			pageCount: info.pageCount || null,
			language: info.language || null,
			categories: info.categories || [],

			// Infos supplémentaires pour mangas
			isbn10: this.extractISBN(info.industryIdentifiers, "ISBN_10"),
			isbn13: this.extractISBN(info.industryIdentifiers, "ISBN_13"),
		};
	}

	/**
	 * Extrait un ISBN spécifique
	 * @param {Array} identifiers - Liste des identifiants
	 * @param {string} type - Type d'ISBN (ISBN_10 ou ISBN_13)
	 * @returns {string|null}
	 */
	extractISBN(identifiers, type) {
		if (!identifiers) return null;
		const isbn = identifiers.find((id) => id.type === type);
		return isbn ? isbn.identifier : null;
	}
}

// Export de l'instance unique du service
export default new GoogleBooksService();
