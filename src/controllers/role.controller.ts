import { Request, Response } from "express";
import { roleService } from "../services";
import { functions } from "../helpers";

export default class RoleController {
  async getAll(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const roles = await roleService.getAll(guildId);

      return res.json(roles);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await roleService.get(id);

      return res.json(role);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
