import { Request, Response } from "express";
import WelcomeService from "../services/welcome.service";
import { welcomeService } from "../services";
import { functions, mappers } from "../helpers";

export default class WelcomeController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await welcomeService.get(guildId);

      if (config) {
        const mappedConfig = mappers.mapWelcome(config);
        return res.json(mappedConfig);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
