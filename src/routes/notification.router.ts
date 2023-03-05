import express from "express";
import { notificationController } from "../controllers";
import { authenticate } from "../middleware/auth";

const notificationRouter = express.Router();

notificationRouter.get("/:guildId", authenticate, notificationController.get);

export default notificationRouter;
