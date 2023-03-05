import { Request, Response } from "express";
import { loggingService } from "../services";
import { functions, mappers } from "../helpers";

export default class LoggingController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await loggingService.get(guildId);

      if (config) {
        const mappedConfig = mappers.mapLogging(config);
        return res.json(mappedConfig);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
