import {
  GuildMember as DiscordMember,
  PartialGuildMember as PartialDiscordMember,
} from "discord.js";
import { memberRepository } from "../data";

/**
 *    @class
 *    Creates a new instance of the MemberService.
 */
export default class MemberService {
  async getAll(guildId: string) {
    return await memberRepository.getAll(guildId);
  }

  async get(id: string) {
    return await memberRepository.get(id);
  }

  async create(member: DiscordMember) {
    return await memberRepository.create(member);
  }

  async update(member: DiscordMember) {
    return await memberRepository.update(member);
  }

  async delete(member: DiscordMember | PartialDiscordMember) {
    await memberRepository.delete(member);
  }
}
