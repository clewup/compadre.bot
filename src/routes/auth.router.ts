import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { functions } from "../helpers";
import { authController } from "../controllers";

const authRouter = express.Router();

authRouter.post("/login", authController.login);

export default authRouter;
