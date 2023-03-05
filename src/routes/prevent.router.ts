import express from "express";
import { preventController } from "../controllers";
import { authenticate } from "../middleware/auth";

const preventRouter = express.Router();

preventRouter.get("/:guildId", authenticate, preventController.get);

export default preventRouter;
