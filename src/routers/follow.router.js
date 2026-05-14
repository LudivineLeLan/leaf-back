import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { followController } from "../controllers/follow.controller.js";

export const followRouter = Router();

followRouter.get("/", authenticate, followController.getFollows);
followRouter.post(
	"/serie/:serieId",
	authenticate,
	followController.followSerie,
);
followRouter.delete(
	"/serie/:serieId",
	authenticate,
	followController.unfollowSerie,
);
followRouter.post(
	"/author/:authorId",
	authenticate,
	followController.followAuthor,
);
followRouter.delete(
	"/author/:authorId",
	authenticate,
	followController.unfollowAuthor,
);
