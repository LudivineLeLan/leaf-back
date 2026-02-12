import { Router } from "express";
import { userBookRouter } from "./userbook.router.js";
import { bookRouter } from "./book.router.js";

export const apiRouter = Router();

apiRouter.use(userBookRouter);
apiRouter.use(bookRouter);
