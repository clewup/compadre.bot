import express from "express";
import { loggingController } from "../controllers";

const loggingRouter = express.Router();

loggingRouter.get("/:guildId", loggingController.get);

export default loggingRouter;
