import LoggingRepository from "../data/logging.repository";
import MemberRepository from "../data/member.repository";
import {
  GuildMember as DiscordMember,
  PartialGuildMember as PartialDiscordMember,
} from "discord.js";

/**
 *    @class
 *    Creates a new instance of the MemberService.
 */
export default class MemberService {
  private readonly repository: MemberRepository;

  constructor(repository: MemberRepository) {
    this.repository = repository;
  }

  async get(member: DiscordMember) {
    return await this.repository.get(member);
  }

  async create(member: DiscordMember) {
    return await this.repository.create(member);
  }

  async update(member: DiscordMember) {
    return await this.repository.update(member);
  }

  async delete(member: DiscordMember | PartialDiscordMember) {
    await this.repository.delete(member);
  }
}
