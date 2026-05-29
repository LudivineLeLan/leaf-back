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

		const cleanName = serie.name.replace(/[-–]\s*$/, "").trim();
		const books = serie.books || [];

		const googleResults = await GoogleBooksService.search(cleanName, 40);

		const seen = new Set();
		const uniqueResults = googleResults.filter((book) => {
			if (seen.has(book.googleBooksId)) return false;
			seen.add(book.googleBooksId);
			return true;
		});

		const allVolumes = uniqueResults
			.map((googleBook) => {
				const seriesInfo = extractSeriesInfo(googleBook.title);
				const bookInLibrary = books.find(
					(book) => book.googleBooksId === googleBook.googleBooksId,
				);
				return {
					googleBooksId: googleBook.googleBooksId,
					title: googleBook.title,
					cover: googleBook.thumbnail,
					seriesPosition:
						bookInLibrary?.seriesPosition || seriesInfo?.position || null,
					isInLibrary: !!bookInLibrary,
					libraryBookId: bookInLibrary?.id || null,
				};
			})
			.sort((a, b) => {
				if (a.seriesPosition === null) return 1;
				if (b.seriesPosition === null) return -1;
				return a.seriesPosition - b.seriesPosition;
			});

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

async function updateSerie(req, res) {
	try {
		const { id } = req.params;
		const { total_volumes } = req.body;

		const serie = await Serie.findByPk(id);
		if (!serie) return res.status(404).json({ message: "Serie not found" });

		await serie.update({ total_volumes });

		return res.json(serie);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export { getSerieById, updateSerie };
