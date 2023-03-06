import { Request, Response } from "express";
import { preventService } from "../services";
import { functions } from "../helpers";
import { preventMapper } from "../mappers";

export default class PreventController {
  async get(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const config = await preventService.get(guildId);

      if (config) {
        const mappedConfig = preventMapper.map(config);
        return res.json(mappedConfig);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
