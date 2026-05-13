import { Serie, Book } from "../models/index.js";
import GoogleBooksService from "../services/GoogleBooksService.js";
import { extractSeriesInfo } from "../services/series.service.js";

async function getSerieById(req, res) {
	try {
		const { id } = req.params;

		const serie = await Serie.findByPk(id, {
			include: [{ model: Book, as: "books" }],
		});

		if (!serie) return res.status(404).json({ message: "Serie not found" });

		// Nettoyer le nom de série avant la recherche
		const cleanName = serie.name.replace(/[-–]\s*$/, "").trim();

		const googleResults = await GoogleBooksService.search(cleanName, 40);

		// Dédupliquer par googleBooksId
		const seen = new Set();
		const uniqueResults = googleResults.filter((book) => {
			if (seen.has(book.googleBooksId)) return false;
			seen.add(book.googleBooksId);
			return true;
		});

		const allVolumes = uniqueResults
			.map((googleBook) => {
				// Extraire la position depuis le titre
				const seriesInfo = extractSeriesInfo(googleBook.title);
				if (!seriesInfo) return null;

				const bookInLibrary = serie.books.find(
					(book) => book.googleBooksId === googleBook.googleBooksId,
				);

				return {
					googleBooksId: googleBook.googleBooksId,
					title: googleBook.title,
					cover: googleBook.thumbnail,
					seriesPosition: bookInLibrary?.seriesPosition || seriesInfo.position,
					isInLibrary: !!bookInLibrary,
					libraryBookId: bookInLibrary?.id || null,
				};
			})
			.filter(Boolean)
			.sort((a, b) => a.seriesPosition - b.seriesPosition);

		return res.json({
			id: serie.id,
			name: cleanName,
			total_volumes: serie.total_volumes,
			volumes: allVolumes,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export { getSerieById };
