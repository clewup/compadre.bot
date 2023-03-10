import Database from "../structures/database";
import { Guild as DiscordGuild } from "discord.js";

export default class WelcomeRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async get(guildId: string) {
    return await this.database.welcomeConfig.findFirst({
      where: { guildId: guildId },
    });
  }

  async create(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ) {
    return await this.database.welcomeConfig.create({
      data: {
        channel: channel,
        role: role,
        message: message,
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
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ) {
    return this.database.welcomeConfig.update({
      where: { guildId: guild.id },
      data: {
        channel: channel,
        role: role,
        message: message,
        enabled: enabled,
      },
    });
  }

  async delete(guild: DiscordGuild) {
    await this.database.welcomeConfig.delete({ where: { guildId: guild.id } });
  }
}
