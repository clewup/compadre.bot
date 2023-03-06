import { Request, Response } from "express";
import { functions } from "../helpers";
import jwt from "jsonwebtoken";
import config from "../config";

export default class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = req.body;

      jwt.sign({ user }, config.jwtKey!, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          res.status(500).json({ error: "Error signing token." });
        } else {
          res.json({ token });
        }
      });
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
