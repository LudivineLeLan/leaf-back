import { Router } from "express";
import { bookController } from "../controllers/index.js";

export const bookRouter = Router();

bookRouter.get("/search", bookController.search);
bookRouter.get("/:googleId", bookController.getByGoogleId);
