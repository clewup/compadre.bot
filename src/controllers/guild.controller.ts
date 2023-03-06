import { Request, Response } from "express";
import { guildService } from "../services";
import { functions } from "../helpers";
import { guildMapper } from "../mappers";

export default class GuildController {
  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const guild = await guildService.get(id);

      if (guild) {
        const mappedGuild = guildMapper.map(guild);
        return res.json(mappedGuild);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
