import express from "express";
import { loggingController, memberController } from "../controllers";
import { authenticate } from "../middleware/auth";

const memberRouter = express.Router();

memberRouter.get("/:guildId", authenticate, memberController.getAll);
memberRouter.get("/id/:id", authenticate, memberController.get);

export default memberRouter;
