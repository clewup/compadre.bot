import express from "express";
import { guildController } from "../controllers";
import { authenticate } from "../middleware/auth";

const guildRouter = express.Router();

guildRouter.get("/:id", authenticate, guildController.get);

export default guildRouter;
