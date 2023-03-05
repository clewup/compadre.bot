import { Request, Response } from "express";
import { guildService } from "../services";
import { functions } from "../helpers";

export default class GuildController {
  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const guild = await guildService.get(id);

      return res.json(guild);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
