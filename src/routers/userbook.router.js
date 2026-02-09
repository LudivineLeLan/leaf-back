import { Router } from "express";
import { userBookController } from "../controllers/index.js";

export const userBookRouter = Router();

userBookRouter.get("/search", userBookController.search);
userBookRouter.get("/:id", userBookController.getDetails);
