import express from "express";
import { loggingController } from "../controllers";
import { authenticate } from "../middleware/auth";

const loggingRouter = express.Router();

loggingRouter.get("/:guildId", authenticate, loggingController.get);

export default loggingRouter;
