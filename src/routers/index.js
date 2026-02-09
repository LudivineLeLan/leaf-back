import { Router } from "express";
import { userBookRouter } from "./userbook.router.js";

export const apiRouter = Router();

apiRouter.use("/user/books", userBookRouter);
