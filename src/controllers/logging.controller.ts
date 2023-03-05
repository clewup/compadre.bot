import { Request, Response } from "express";
import { loggingService } from "../services";
import { functions } from "../helpers";

export default class LoggingController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await loggingService.get(guildId);

      return res.json(config);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
