// src/migrations/fix-series.js
import { sequelize } from "../models/index.js";
import { Book } from "../models/book.model.js";
import { attachSerieToBook } from "../services/series.service.js";

await sequelize.authenticate();
console.log("Fixing series...");

const books = await Book.findAll({ where: { serieId: null } });

for (const book of books) {
	await attachSerieToBook(book);
	console.log(`Processed: ${book.title}`);
}

console.log("Done!");
await sequelize.close();
