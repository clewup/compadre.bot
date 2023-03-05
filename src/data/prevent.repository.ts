import Database from "../structures/database";
import { Guild as DiscordGuild } from "discord.js";
import { PreventConfig } from "@prisma/client";

export default class PreventRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async get(guild: DiscordGuild) {
    return await this.database.preventConfig.findFirst({
      where: { guildId: guild.id },
    });
  }

  async create(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    enabled: boolean
  ) {
    return await this.database.preventConfig.create({
      data: {
        role: role,
        links: links,
        enabled: enabled,
        guild: {
          connect: {
            id: guild.id,
          },
        },
      },
    });
  }

  async update(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    enabled: boolean
  ) {
    return this.database.preventConfig.update({
      where: { guildId: guild.id },
      data: {
        role: role,
        links: links,
        enabled: enabled,
      },
    });
  }

  async delete(guild: DiscordGuild) {
    await this.database.preventConfig.delete({ where: { guildId: guild.id } });
  }
}
