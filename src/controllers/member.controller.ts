import { Request, Response } from "express";
import { memberService } from "../services";
import { functions } from "../helpers";
import { memberMapper } from "../mappers";

export default class MemberController {
  async getAll(req: Request, res: Response) {
    try {
      const guildId = req.params.guildId;
      const members = await memberService.getAll(guildId);

      if (members.length) {
        const mappedMembers: object[] = [];
        members.forEach((member) => {
          mappedMembers.push(memberMapper.map(member));
        });

        return res.json(mappedMembers);
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
      const member = await memberService.get(id);

      if (member) {
        const mappedMember = memberMapper.map(member);
        return res.json(mappedMember);
      }

      return res.sendStatus(204);
    } catch (error) {
      res.statusCode = 500;
      res.json(functions.formatApiError(error));
    }
  }
}
