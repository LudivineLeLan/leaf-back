import { Router } from "express";
import { bookController } from "../controllers/index.js";
import { optionalAuthenticate } from "../middlewares/authenticate.middleware.js";

export const bookRouter = Router();

bookRouter.get("/search", optionalAuthenticate, bookController.search);
bookRouter.get("/:googleId", bookController.getByGoogleId);
bookRouter.post("/import", bookController.importBook);
