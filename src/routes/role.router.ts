import express from "express";
import { roleController } from "../controllers";
import { authenticate } from "../middleware/auth";

const roleRouter = express.Router();

roleRouter.get("/:guildId", authenticate, roleController.getAll);
roleRouter.get("/id/:id", authenticate, roleController.get);

export default roleRouter;
