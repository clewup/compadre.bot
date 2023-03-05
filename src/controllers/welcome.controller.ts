import { Request, Response } from "express";
import WelcomeService from "../services/welcome.service";
import { welcomeService } from "../services";
import { functions } from "../helpers";

export default class WelcomeController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await welcomeService.get(guildId);

      return res.send(config);
    } catch (error) {
      res.statusCode = 500;
      res.send(functions.formatApiError(error));
    }
  }
}
