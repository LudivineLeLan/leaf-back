import { sequelize } from "../models/index.js";
import { Serie, Book } from "../models/index.js";
import { Op } from "sequelize";

await sequelize.authenticate();
console.log("Fixing duplicate series...");

const series = await Serie.findAll();

for (const serie of series) {
	const normalized = serie.name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[-–_]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	// Find duplicates with same normalized name
	const duplicates = series.filter(
		(otherSerie) =>
			otherSerie.id !== serie.id &&
			otherSerie.name
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/[-–_]/g, " ")
				.replace(/\s+/g, " ")
				.trim() === normalized,
	);

	for (const duplicate of duplicates) {
		console.log(`Merging "${duplicate.name}" into "${serie.name}"`);

		// Reassign books from duplicate to main serie
		await Book.update(
			{ serieId: serie.id },
			{ where: { serieId: duplicate.id } },
		);

		// Delete duplicate
		await duplicate.destroy();
	}
}

console.log("Done!");
await sequelize.close();
