import Database from "../structures/database";
import { Guild as DiscordGuild } from "discord.js";
import { NotificationConfig } from "@prisma/client";

export default class NotificationRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async get(guild: DiscordGuild) {
    return await this.database.notificationConfig.findFirst({
      where: { guildId: guild.id },
    });
  }

  async create(guild: DiscordGuild, channel: string | null, enabled: boolean) {
    return await this.database.notificationConfig.create({
      data: {
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

  async update(guild: DiscordGuild, channel: string | null, enabled: boolean) {
    return this.database.notificationConfig.update({
      where: { guildId: guild.id },
      data: {
        channel: channel,
        enabled: enabled,
      },
    });
  }

  async delete(guild: DiscordGuild) {
    await this.database.notificationConfig.delete({
      where: { guildId: guild.id },
    });
  }
}
