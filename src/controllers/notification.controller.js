import { Notification } from "../models/index.js";
import {
	checkNewBooksForSeries,
	checkNewBooksForAuthors,
} from "../services/notification.service.js";

export const notificationController = {
	async triggerCheck(req, res) {
		try {
			await checkNewBooksForSeries();
			await checkNewBooksForAuthors();
			return res.json({ message: "Vérification terminée" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async getNotifications(req, res) {
		try {
			const notifications = await Notification.findAll({
				where: { userId: req.user.id },
				order: [["created_at", "DESC"]],
			});

			return res.json(notifications);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async markAsRead(req, res) {
		try {
			await Notification.update(
				{ isRead: true },
				{ where: { userId: req.user.id } },
			);

			return res.json({ message: "Notifications marquées comme lues" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},

	async getUnreadCount(req, res) {
		try {
			const count = await Notification.count({
				where: { userId: req.user.id, isRead: false },
			});

			return res.json({ count });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Erreur serveur" });
		}
	},
};
