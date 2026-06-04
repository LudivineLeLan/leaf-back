import { Router } from "express";
import { authorController } from "../controllers/author.controller.js";
import { optionalAuthenticate } from "../middlewares/authenticate.middleware.js";

export const authorRouter = Router();

authorRouter.get(
	"/:authorId",
	optionalAuthenticate,
	authorController.getAuthorById,
);
