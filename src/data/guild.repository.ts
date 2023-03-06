import Database from "../structures/database";
import { Guild as DiscordGuild } from "discord.js";

export default class GuildRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async get(id: string) {
    return await this.database.guild.findFirst({ where: { id: id } });
  }

  async create(guild: DiscordGuild) {
    return await this.database.guild.create({
      data: {
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,
      },
    });
  }

  async update(guild: DiscordGuild) {
    return await this.database.guild.update({
      where: { id: guild.id },
      data: {
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,
      },
    });
  }

  async delete(guild: DiscordGuild) {
    await this.database.guild.delete({ where: { id: guild.id } });
  }
}
