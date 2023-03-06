import { Request, Response } from "express";
import { welcomeService } from "../services";
import { functions } from "../helpers";
import { welcomeMapper } from "../mappers";

export default class WelcomeController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await welcomeService.get(guildId);

      if (config) {
        const mappedConfig = welcomeMapper.map(config);
        return res.json(mappedConfig);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
