import express from "express";
import { preventController } from "../controllers";

const preventRouter = express.Router();

preventRouter.get("/:guildId", preventController.get);

export default preventRouter;
