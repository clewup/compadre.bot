import express from "express";
import { welcomeController } from "../controllers";

const welcomeRouter = express.Router();

welcomeRouter.get("/:guildId", welcomeController.get);

export default welcomeRouter;
