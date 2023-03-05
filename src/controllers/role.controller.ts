import { Request, Response } from "express";
import { roleService } from "../services";
import { functions, mappers } from "../helpers";

export default class RoleController {
  async getAll(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const roles = await roleService.getAll(guildId);

      if (roles.length) {
        const mappedRoles: object[] = [];
        roles.forEach((role) => {
          mappedRoles.push(mappers.mapRole(role));
        });

        return res.json(mappedRoles);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await roleService.get(id);

      if (role) {
        const mappedRole = mappers.mapRole(role);
        return res.json(mappedRole);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
