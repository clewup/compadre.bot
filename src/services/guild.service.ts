import Database from "../structures/database";
import { Guild } from "@prisma/client";
import { Guild as DiscordGuild } from "discord.js";
import GuildRepository from "../data/guild.repository";
import MemberRepository from "../data/member.repository";
import RoleRepository from "../data/role.repository";

/**
 *    @class
 *    Creates a new instance of the GuildService.
 */
export default class GuildService {
  private readonly repository: GuildRepository;
  private readonly memberRepository: MemberRepository;
  private readonly roleRepository: RoleRepository;

  constructor(
    repository: GuildRepository,
    memberRepository: MemberRepository,
    roleRepository: RoleRepository
  ) {
    this.repository = repository;
    this.memberRepository = memberRepository;
    this.roleRepository = roleRepository;
  }

  async get(guild: DiscordGuild) {
    return await this.repository.get(guild);
  }

  async create(guild: DiscordGuild) {
    await this.repository.create(guild);

    const members = await guild.members.list();
    members.forEach(async (member) => {
      await this.memberRepository.create(member);
    });

    const roles = await guild.roles.valueOf();
    roles.forEach(async (role) => {
      await this.roleRepository.create(role);
    });

    return await this.repository.get(guild);
  }

  async update(guild: DiscordGuild) {
    return await this.repository.update(guild);
  }

  async delete(guild: DiscordGuild) {
    await this.repository.delete(guild);
  }
}
