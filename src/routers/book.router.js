import { Router } from "express";
import { bookController } from "../controllers/index.js";
import {
	authenticate,
	optionalAuthenticate,
} from "../middlewares/authenticate.middleware.js";

export const bookRouter = Router();

bookRouter.get("/search", optionalAuthenticate, bookController.search);
bookRouter.get("/:googleId", bookController.getByGoogleId);
bookRouter.get("/id/:bookId", optionalAuthenticate, bookController.getBookById);
bookRouter.post("/import", authenticate, bookController.importBook);
