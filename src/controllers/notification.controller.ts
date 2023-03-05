import { Request, Response } from "express";
import { notificationService } from "../services";
import { functions, mappers } from "../helpers";

export default class NotificationController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await notificationService.get(guildId);

      if (config) {
        const mappedConfig = mappers.mapNotification(config);
        return res.json(mappedConfig);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
