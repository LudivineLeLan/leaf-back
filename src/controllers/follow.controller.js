import { UserSerie, UserAuthor, Serie, Author } from "../models/index.js";

export const followController = {
	async followSerie(req, res) {
		try {
			const userId = req.user.id;
			const { serieId } = req.params;

			const [userSerie, created] = await UserSerie.findOrCreate({
				where: { userId, serieId },
				defaults: { userId, serieId },
			});

			if (!created) {
				return res
					.status(400)
					.json({ message: "Vous suivez déjà cette série" });
			}

			return res.status(201).json({ message: "Série suivie", userSerie });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async unfollowSerie(req, res) {
		try {
			const userId = req.user.id;
			const { serieId } = req.params;

			const deleted = await UserSerie.destroy({ where: { userId, serieId } });

			if (!deleted) {
				return res
					.status(404)
					.json({ message: "Vous ne suivez pas cette série" });
			}

			return res.status(200).json({ message: "Série non suivie" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async followAuthor(req, res) {
		try {
			const userId = req.user.id;
			const { authorId } = req.params;

			const [userAuthor, created] = await UserAuthor.findOrCreate({
				where: { userId, authorId },
			});

			if (!created) {
				return res.status(400).json({ message: "Vous suivez déjà cet auteur" });
			}

			return res.status(201).json({ message: "Auteur suivi", userAuthor });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async unfollowAuthor(req, res) {
		try {
			const userId = req.user.id;
			const { authorId } = req.params;

			const deleted = await UserAuthor.destroy({ where: { userId, authorId } });

			if (!deleted) {
				return res
					.status(404)
					.json({ message: "Vous ne suivez pas cet auteur" });
			}

			return res.status(200).json({ message: "Auteur non suivi" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async getFollows(req, res) {
		try {
			const userId = req.user.id;

			const [series, authors] = await Promise.all([
				UserSerie.findAll({
					where: { userId },
					include: [{ model: Serie, as: "serie" }],
				}),
				UserAuthor.findAll({
					where: { userId },
					include: [{ model: Author, as: "author" }],
				}),
			]);

			return res.json({ series, authors });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},
};
