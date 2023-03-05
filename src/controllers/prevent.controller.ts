import { Request, Response } from "express";
import { preventService } from "../services";
import { functions, mappers } from "../helpers";

export default class PreventController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await preventService.get(guildId);

      if (config) {
        const mappedConfig = mappers.mapPrevent(config);
        return res.json(mappedConfig);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
