import cron from "node-cron";
import { Op } from "sequelize";
import {
	UserSerie,
	UserAuthor,
	Serie,
	Author,
	Book,
	Notification,
} from "../models/index.js";

// Helpers

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchGoogleBooks(query, maxResults = 40) {
	const params = new URLSearchParams({
		q: query,
		maxResults: String(maxResults),
		hl: "fr",
		country: "FR",
		key: process.env.GOOGLE_BOOKS_API_KEY,
	});

	const url = `https://www.googleapis.com/books/v1/volumes?${params}`;
	const response = await fetch(url);

	if (!response.ok)
		throw new Error(`Google Books API error: ${response.status}`);

	const data = await response.json();
	return data.items || [];
}

// Series check

async function checkNewBooksForSeries() {
	try {
		const userSeries = await UserSerie.findAll({
			include: [
				{
					model: Serie,
					as: "serie",
					include: [{ model: Book, as: "books" }],
				},
			],
		});

		// Group by serieId to avoid duplicate API calls when multiple users
		// follow the same series
		const serieMap = new Map();
		for (const userSerie of userSeries) {
			if (!userSerie.serie) continue;
			if (!serieMap.has(userSerie.serieId)) {
				serieMap.set(userSerie.serieId, {
					serie: userSerie.serie,
					userIds: [],
				});
			}
			serieMap.get(userSerie.serieId).userIds.push(userSerie.userId);
		}

		// Pre-load all known googleBooksIds to avoid per-book DB queries
		const knownBooks = await Book.findAll({ attributes: ["googleBooksId"] });
		const knownGoogleIds = new Set(
			knownBooks.map((book) => book.googleBooksId).filter(Boolean),
		);

		for (const { serie, userIds } of serieMap.values()) {
			const cleanName = serie.name.replace(/[-–]\s*$/, "").trim();

			let googleResults;
			try {
				googleResults = await searchGoogleBooks(cleanName);
			} catch (error) {
				console.error(`Erreur API pour la série "${cleanName}":`, error);
				await delay(500);
				continue;
			}

			// Collect only new books (not in DB) with a valid title
			const newBooks = googleResults.filter(
				(item) => item.volumeInfo?.title && !knownGoogleIds.has(item.id),
			);

			for (const userId of userIds) {
				// Load all existing notifications for this user in one query
				const existingNotifIds = new Set(
					(
						await Notification.findAll({
							where: {
								userId,
								googleBooksId: { [Op.in]: newBooks.map((item) => item.id) },
							},
							attributes: ["googleBooksId"],
						})
					).map((notif) => notif.googleBooksId),
				);

				const notificationsToCreate = newBooks
					.filter((item) => !existingNotifIds.has(item.id))
					.map((item) => ({
						userId,
						message: `Nouveau livre détecté dans la série "${cleanName}" : "${item.volumeInfo.title}"`,
						type: "new_book",
						googleBooksId: item.id,
						isRead: false,
					}));

				if (notificationsToCreate.length > 0) {
					await Notification.bulkCreate(notificationsToCreate);
				}
			}

			// Respect Google Books API rate limits between series
			await delay(200);
		}
	} catch (error) {
		console.error("Erreur checkNewBooksForSeries:", error);
	}
}

// Authors check

async function checkNewBooksForAuthors() {
	try {
		const userAuthors = await UserAuthor.findAll({
			include: [{ model: Author, as: "author" }],
		});

		// Group by authorId to avoid duplicate API calls
		const authorMap = new Map();
		for (const userAuthor of userAuthors) {
			if (!userAuthor.author) continue;
			if (!authorMap.has(userAuthor.authorId)) {
				authorMap.set(userAuthor.authorId, {
					author: userAuthor.author,
					userIds: [],
				});
			}
			authorMap.get(userAuthor.authorId).userIds.push(userAuthor.userId);
		}

		// Pre-load all known googleBooksIds
		const knownBooks = await Book.findAll({ attributes: ["googleBooksId"] });
		const knownGoogleIds = new Set(
			knownBooks.map((book) => book.googleBooksId).filter(Boolean),
		);

		for (const { author, userIds } of authorMap.values()) {
			const query = `${author.firstname} ${author.name}`;

			let googleResults;
			try {
				googleResults = await searchGoogleBooks(query, 20);
			} catch (error) {
				console.error(`Erreur API pour l'auteur "${query}":`, error);
				await delay(500);
				continue;
			}

			const newBooks = googleResults.filter(
				(item) => item.volumeInfo?.title && !knownGoogleIds.has(item.id),
			);

			for (const userId of userIds) {
				const existingNotifIds = new Set(
					(
						await Notification.findAll({
							where: {
								userId,
								googleBooksId: { [Op.in]: newBooks.map((item) => item.id) },
							},
							attributes: ["googleBooksId"],
						})
					).map((notif) => notif.googleBooksId),
				);

				const notificationsToCreate = newBooks
					.filter((item) => !existingNotifIds.has(item.id))
					.map((item) => ({
						userId,
						message: `Nouveau livre de ${author.firstname} ${author.name} : "${item.volumeInfo.title}"`,
						type: "new_book",
						googleBooksId: item.id,
						isRead: false,
					}));

				if (notificationsToCreate.length > 0) {
					await Notification.bulkCreate(notificationsToCreate);
				}
			}

			await delay(200);
		}
	} catch (error) {
		console.error("Erreur checkNewBooksForAuthors:", error);
	}
}

// Cron job

let isRunning = false;

function startNotificationJob() {
	cron.schedule("0 0 * * *", async () => {
		if (isRunning) {
			console.log("Job déjà en cours, passage ignoré.");
			return;
		}

		isRunning = true;
		console.log("Vérification des nouvelles publications...");

		try {
			await checkNewBooksForSeries();
			await checkNewBooksForAuthors();
			console.log("Vérification terminée.");
		} finally {
			// Always release the lock, even if an unexpected error occurs
			isRunning = false;
		}
	});
}

export {
	startNotificationJob,
	checkNewBooksForSeries,
	checkNewBooksForAuthors,
};
