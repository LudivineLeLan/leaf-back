import { Serie } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Normalize serie's name to avoid doubles
 */
function normalizeSerieName(name) {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.replace(/[-–_]/g, " ") // Replace dashes by spaces
		.replace(/\s+/g, " ") // Remove extra spaces
		.trim();
}

/**
 * Find serie & tome number from book title
 */
function extractSeriesInfo(title) {
	if (!title) return null;

	const patterns = [
		/(.+?)\s+tome\s*(\d+)/i,
		/(.+?)\s+vol(?:ume|\.)?\s*(\d+)/i,
		/(.+?)\s+part\s*(\d+)/i,
		/(.+?)\s+book\s*(\d+)/i,
		/(.+?)\s+(\d+)\s*$/,
		/(.+?)\s+t\.\s*(\d+)/i,
		/(.+?)\s+t(\d+)\s*$/i, // for "T01" without dot
	];

	for (const pattern of patterns) {
		const match = title.match(pattern);
		if (match) {
			return {
				name: match[1]
					.replace(/\s*[-–,:]\s*$/, "")
					.replace(/[,،。]\s*$/, "")
					.trim(),
				position: parseInt(match[2], 10),
			};
		}
	}

	return null;
}

/**
 * Find or create serie in db
 */
async function findOrCreateSerie(name) {
	const normalizedName = normalizeSerieName(name);

	let serie = await Serie.findOne({
		where: { normalizedName },
	});

	if (!serie) {
		serie = await Serie.create({
			name,
			normalizedName,
		});
	}

	return serie;
}

/**
 * Links serie to book
 */
async function attachSerieToBook(book) {
	if (!book || !book.title) return book;

	const seriesInfo = extractSeriesInfo(book.title);

	if (seriesInfo) {
		// Pattern detected — find or create serie
		const serie = await findOrCreateSerie(seriesInfo.name);
		book.serieId = serie.id;
		book.seriesPosition = seriesInfo.position;
		book.seriesDetected = true;
		await book.save();
		return book;
	}

	// No pattern — try to match with existing series by name
	const normalizedTitle = normalizeSerieName(book.title);

	const matchingSerie = await Serie.findOne({
		where: {
			normalizedName: { [Op.iLike]: `%${normalizedTitle}%` },
		},
	});

	if (matchingSerie) {
		book.serieId = matchingSerie.id;
		book.seriesDetected = true;
		await book.save();
	}

	return book;
}

export { extractSeriesInfo, findOrCreateSerie, attachSerieToBook };
