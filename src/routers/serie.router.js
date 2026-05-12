import { Router } from "express";
import { getSerieById } from "../controllers/serie.controller.js";

export const serieRouter = Router();

serieRouter.get("/:id", getSerieById);
