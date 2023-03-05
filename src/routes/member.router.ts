import express from "express";
import { loggingController, memberController } from "../controllers";

const memberRouter = express.Router();

memberRouter.get("/:guildId", memberController.getAll);
memberRouter.get("/id/:id", memberController.get);

export default memberRouter;
