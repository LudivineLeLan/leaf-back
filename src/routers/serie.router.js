import { Router } from "express";
import { getSerieById, updateSerie } from "../controllers/serie.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

export const serieRouter = Router();

serieRouter.get("/:id", getSerieById);
serieRouter.patch("/:id", authenticate, updateSerie);
