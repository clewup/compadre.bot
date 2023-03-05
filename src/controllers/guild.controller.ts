import { Request, Response } from "express";
import { guildService } from "../services";
import { functions, mappers } from "../helpers";
import { Guild } from "@prisma/client";

export default class GuildController {
  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      let guild = await guildService.get(id);

      if (guild) {
        const mappedGuild = mappers.mapGuild(guild);
        return res.json(mappedGuild);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
