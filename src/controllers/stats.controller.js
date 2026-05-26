import { UserBook, UserSerie, UserAuthor } from "../models/index.js";

export const statsController = {
	async getStats(req, res) {
		try {
			const userId = req.user.id;

			const [
				total,
				toRead,
				reading,
				finished,
				seriesFollowed,
				authorsFollowed,
			] = await Promise.all([
				UserBook.count({ where: { userId } }),
				UserBook.count({ where: { userId, status: "to_read" } }),
				UserBook.count({ where: { userId, status: "reading" } }),
				UserBook.count({ where: { userId, status: "finished" } }),
				UserSerie.count({ where: { userId } }),
				UserAuthor.count({ where: { userId } }),
			]);

			return res.json({
				total,
				toRead,
				reading,
				finished,
				seriesFollowed,
				authorsFollowed,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},
};
