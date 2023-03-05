import Database from "../structures/database";
import { Guild } from "@prisma/client";
import { Guild as DiscordGuild } from "discord.js";
import { guildRepository, memberRepository, roleRepository } from "../data";

/**
 *    @class
 *    Creates a new instance of the GuildService.
 */
export default class GuildService {
  async get(id: string) {
    return await guildRepository.get(id);
  }

  async create(guild: DiscordGuild) {
    await guildRepository.create(guild);

    const members = await guild.members.list();
    members.forEach(async (member) => {
      await memberRepository.create(member);
    });

    const roles = await guild.roles.valueOf();
    roles.forEach(async (role) => {
      await roleRepository.create(role);
    });

    return await guildRepository.get(guild.id);
  }

  async update(guild: DiscordGuild) {
    return await guildRepository.update(guild);
  }

  async delete(guild: DiscordGuild) {
    await guildRepository.delete(guild);
  }
}
