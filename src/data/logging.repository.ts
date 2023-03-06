import Database from "../structures/database";
import { Guild as DiscordGuild } from "discord.js";

export default class LoggingRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async get(guildId: string) {
    return await this.database.loggingConfig.findFirst({
      where: { guildId: guildId },
    });
  }

  async create(
    guild: DiscordGuild,
    role: string | null,
    channel: string | null,
    enabled: boolean
  ) {
    return await this.database.loggingConfig.create({
      data: {
        role: role,
        channel: channel,
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
    channel: string | null,
    enabled: boolean
  ) {
    return this.database.loggingConfig.update({
      where: { guildId: guild.id },
      data: {
        channel: channel,
        role: role,
        enabled: enabled,
      },
    });
  }

  async delete(guild: DiscordGuild) {
    await this.database.loggingConfig.delete({
      where: { guildId: guild.id },
    });
  }
}
