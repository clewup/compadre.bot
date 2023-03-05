import express from "express";
import { roleController } from "../controllers";

const roleRouter = express.Router();

roleRouter.get("/:guildId", roleController.getAll);
roleRouter.get("/id/:id", roleController.get);

export default roleRouter;
