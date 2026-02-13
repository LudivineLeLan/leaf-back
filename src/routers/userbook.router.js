import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { userBookController } from "../controllers/index.js";

export const userBookRouter = Router();

userBookRouter.get("/search", userBookController.search);
userBookRouter.get("/:bookId", userBookController.getDetails);
userBookRouter.post(
	"/:bookId",
	authenticate,
	userBookController.addBookToUserList,
);
userBookRouter.put(
	"/:bookId",
	authenticate,
	userBookController.updateReadStatus,
);
