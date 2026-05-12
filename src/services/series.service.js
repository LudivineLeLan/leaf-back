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
		/(.+?)\s+tome\s*(\d+)/i,
		/(.+?)\s+vol(?:ume|\.)?\s*(\d+)/i,
		/(.+?)\s+part\s*(\d+)/i,
		/(.+?)\s+book\s*(\d+)/i,
		/(.+?)\s+(\d+)\s*$/,
		/(.+?)\s+t\.\s*(\d+)/i,
	];

	for (const pattern of patterns) {
		const match = title.match(pattern);
		if (match) {
			return {
				name: match[1].replace(/\s*[-–:]\s*$/, "").trim(),
				position: parseInt(match[2], 10),
			};
		}
	}

	return null;
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
	book.seriesDetected = true;

	await book.save();

	return book;
}

export { extractSeriesInfo, findOrCreateSerie, attachSerieToBook };
