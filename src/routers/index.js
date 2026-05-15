import { Router } from "express";
import { userBookRouter } from "./userbook.router.js";
import { bookRouter } from "./book.router.js";
import { authRouter } from "./auth.router.js";
import { serieRouter } from "./serie.router.js";
import { followRouter } from "./follow.router.js";
import { notificationRouter } from "./notification.router.js";

export const apiRouter = Router();

apiRouter.use("/library", userBookRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/serie", serieRouter);
apiRouter.use("/follows", followRouter);
apiRouter.use("/notifications", notificationRouter);
