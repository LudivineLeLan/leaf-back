import { Serie } from "../models/index.js";

/**
 * Normalise le nom d'une série pour éviter les doublons
 */
function normalizeSerieName(name) {
	return name
		.toLowerCase()
		.normalize("NFD") // enlève accents
		.replace(/[\u0300-\u036f]/g, "")
		.trim();
}

/**
 * Détecte une série et un numéro de tome à partir du titre
 */
function extractSeriesInfo(title) {
	if (!title) return null;

	const patterns = [
		/tome\s*(\d+)/i,
		/t\.\s*(\d+)/i,
		/volume\s*(\d+)/i,
		/vol\.\s*(\d+)/i,
		/book\s*(\d+)/i,
		/part\s*(\d+)/i,
		/(\d+)\s*$/,
	];

	let position = null;
	let matchedPattern = null;

	for (const pattern of patterns) {
		const match = title.match(pattern);
		if (match) {
			position = parseInt(match[1], 10);
			matchedPattern = pattern;
			break;
		}
	}

	if (!position) return null;

	// enlève la partie "tome X" du titre pour récupérer le nom de série
	const name = title
		.replace(/(tome|t\.|volume|vol\.|book|part)\s*\d+.*/i, "")
		.replace(/\d+\s*$/, "")
		.trim();

	if (!name) return null;

	return {
		name,
		position,
	};
}

/**
 * Trouve ou crée une série en base
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
 * Attache automatiquement une série à un livre
 */
async function attachSerieToBook(book) {
	if (!book || !book.title) return book;

	const seriesInfo = extractSeriesInfo(book.title);

	if (!seriesInfo) return book;

	const serie = await findOrCreateSerie(seriesInfo.name);

	book.serieId = serie.id;
	book.seriesPosition = seriesInfo.position;

	await book.save();

	return book;
}

export { extractSeriesInfo, findOrCreateSerie, attachSerieToBook };
