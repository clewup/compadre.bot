import express from "express";
import { welcomeController } from "../controllers";
import { authenticate } from "../middleware/auth";

const welcomeRouter = express.Router();

welcomeRouter.get("/:guildId", authenticate, welcomeController.get);

export default welcomeRouter;
