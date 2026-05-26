import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { statsController } from "../controllers/stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/", authenticate, statsController.getStats);
