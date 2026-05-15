import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { notificationController } from "../controllers/notification.controller.js";

export const notificationRouter = Router();

notificationRouter.get(
	"/",
	authenticate,
	notificationController.getNotifications,
);
notificationRouter.get(
	"/unread",
	authenticate,
	notificationController.getUnreadCount,
);
notificationRouter.put(
	"/read",
	authenticate,
	notificationController.markAsRead,
);

notificationRouter.post(
	"/check",
	authenticate,
	notificationController.triggerCheck,
);
