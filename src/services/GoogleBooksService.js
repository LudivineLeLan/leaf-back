class GoogleBooksService {
	constructor() {
		this.baseURL = "https://www.googleapis.com/books/v1/volumes";
	}

	/**
	 * Books search
	 * @param {string} query - Search query
	 * @param {number} maxResults - Results (default: max 10)
	 * @returns {Promise<Array>} - List of books
	 */
	async search(query, maxResults = 10) {
		try {
			const url = `${this.baseURL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
			const response = await fetch(url);

			if (!response.ok)
				throw new Error(`Google Books API error: ${response.status}`);
			const data = await response.json();
			if (!data.items || data.items.length === 0) return [];
			return data.items.map((book) => this.formatBook(book));
		} catch (error) {
			console.error("Error searching books:", error.message);
			throw error;
		}
	}

	/**
	 * Get book details via Google Books id
	 * @param {string} googleBooksId - Google books id
	 * @returns {Promise<Object>} - Book details
	 */
	async getById(googleBooksId) {
		try {
			const url = `${this.baseURL}/${googleBooksId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`;
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
	 * Keeps only useful informations
	 * @param {Object} book - Book from API
	 * @returns {Object} - Formated book
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

			// Additionnal infos for mangas
			isbn10: this.extractISBN(info.industryIdentifiers, "ISBN_10"),
			isbn13: this.extractISBN(info.industryIdentifiers, "ISBN_13"),
		};
	}

	/**
	 * Extract specific ISBN
	 * @param {Array} identifiers - List of id
	 * @param {string} type - ISBN type (ISBN_10 or ISBN_13)
	 * @returns {string|null}
	 */
	extractISBN(identifiers, type) {
		if (!identifiers) return null;
		const isbn = identifiers.find((id) => id.type === type);
		return isbn ? isbn.identifier : null;
	}
}
export default new GoogleBooksService();
