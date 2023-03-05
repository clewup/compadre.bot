import express from "express";
import { notificationController } from "../controllers";

const notificationRouter = express.Router();

notificationRouter.get("/:guildId", notificationController.get);

export default notificationRouter;
