import { Request, Response } from "express";
import { memberService } from "../services";
import { functions } from "../helpers";

export default class MemberController {
  async getAll(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const members = await memberService.getAll(guildId);

      return res.json(members);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }

  async get(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const member = await memberService.get(id);

      return res.json(member);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
