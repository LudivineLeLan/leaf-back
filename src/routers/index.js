import { Router } from "express";
import { userBookRouter } from "./userbook.router.js";
import { bookRouter } from "./book.router.js";
import { authRouter } from "./auth.router.js";

export const apiRouter = Router();

apiRouter.use("/librairy", userBookRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/auth", authRouter);
