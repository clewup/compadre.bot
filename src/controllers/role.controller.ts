import { Request, Response } from "express";
import { roleService } from "../services";
import { functions } from "../helpers";

export default class RoleController {
  async getAll(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const roles = await roleService.getAll(guildId);

      return res.send(roles);
    } catch (error) {
      res.statusCode = 500;
      res.send(functions.formatApiError(error));
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await roleService.get(id);

      return res.send(role);
    } catch (error) {
      res.statusCode = 500;
      res.send(functions.formatApiError(error));
    }
  }
}
