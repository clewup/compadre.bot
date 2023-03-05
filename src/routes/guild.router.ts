import express from "express";
import { guildController } from "../controllers";

const guildRouter = express.Router();

guildRouter.get("/:id", guildController.get);

export default guildRouter;
