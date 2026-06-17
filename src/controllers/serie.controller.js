import { Serie, Book, Author } from "../models/index.js";
import GoogleBooksService from "../services/GoogleBooksService.js";
import { extractSeriesInfo } from "../services/series.service.js";

async function getSerieById(req, res) {
  try {
    const { id } = req.params;

    const serie = await Serie.findByPk(id, {
      include: [
        {
          model: Book,
          as: "books",
          include: [
            { model: Author, as: "authors", through: { attributes: [] } },
          ],
        },
      ],
    });

    if (!serie) return res.status(404).json({ message: "Serie not found" });

    const cleanName = serie.name.replace(/[-–]\s*$/, "").trim();
    const books = serie.books || [];

    const authorNames = [
      ...new Set(
        books
          .flatMap((book) => book.authors || [])
          .map((author) => `${author.firstname || ""} ${author.name}`.trim()),
      ),
    ];

    // Send serie data + author name for frontend Google Books search
    return res.json({
      id: serie.id,
      name: cleanName,
      total_volumes: serie.total_volumes,
      searchQuery: authorNames.length > 0 ? `${cleanName} ${authorNames[0]}` : cleanName,
      libraryBooks: books.map((book) => ({
        googleBooksId: book.googleBooksId,
        id: book.id,
        seriesPosition: book.seriesPosition,
      })),
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
