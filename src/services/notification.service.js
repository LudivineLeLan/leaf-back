import cron from "node-cron";
import {
	UserSerie,
	UserAuthor,
	Serie,
	Author,
	Book,
	Notification,
} from "../models/index.js";

async function searchGoogleBooks(query, maxResults = 40) {
	const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
	const response = await fetch(url, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", //to simulate navigator request
		},
	});
	if (!response.ok)
		throw new Error(`Google Books API error: ${response.status}`);
	const data = await response.json();
	return data.items || [];
}

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

		for (const userSerie of userSeries) {
			const serie = userSerie.serie;
			if (!serie) continue;

			const cleanName = serie.name.replace(/[-–]\s*$/, "").trim();
			const googleResults = await searchGoogleBooks(cleanName);

			for (const item of googleResults) {
				const googleBooksId = item.id;
				const title = item.volumeInfo?.title;

				const existingBook = await Book.findOne({
					where: { googleBooksId },
				});

				if (!existingBook) {
					// Vérifier qu'on n'a pas déjà créé cette notification
					const existingNotif = await Notification.findOne({
						where: { userId: userSerie.userId, googleBooksId },
					});

					if (!existingNotif) {
						await Notification.create({
							userId: userSerie.userId,
							message: `Nouveau livre détecté dans la série "${cleanName}" : "${title}"`,
							type: "new_book",
							googleBooksId,
							isRead: false,
						});
					}
				}
			}
		}
	} catch (error) {
		console.error("Erreur checkNewBooksForSeries:", error);
	}
}

async function checkNewBooksForAuthors() {
	try {
		const userAuthors = await UserAuthor.findAll({
			include: [
				{
					model: Author,
					as: "author",
				},
			],
		});

		for (const userAuthor of userAuthors) {
			const author = userAuthor.author;
			if (!author) continue;

			const query = `${author.firstname} ${author.name}`;
			const googleResults = await searchGoogleBooks(query, 20);

			for (const item of googleResults) {
				const googleBooksId = item.id;
				const title = item.volumeInfo?.title;

				const existingBook = await Book.findOne({
					where: { googleBooksId },
				});

				if (!existingBook) {
					const existingNotif = await Notification.findOne({
						where: { userId: userAuthor.userId, googleBooksId },
					});

					if (!existingNotif) {
						await Notification.create({
							userId: userAuthor.userId,
							message: `Nouveau livre de ${author.firstname} ${author.name} : "${title}"`,
							type: "new_book",
							googleBooksId,
							isRead: false,
						});
					}
				}
			}
		}
	} catch (error) {
		console.error("Erreur checkNewBooksForAuthors:", error);
	}
}

function startNotificationJob() {
	cron.schedule("0 */6 * * *", async () => {
		console.log("🔔 Vérification des nouvelles publications...");
		await checkNewBooksForSeries();
		await checkNewBooksForAuthors();
		console.log("✅ Vérification terminée");
	});
}
export {
	startNotificationJob,
	checkNewBooksForSeries,
	checkNewBooksForAuthors,
};
