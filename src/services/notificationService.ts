import Database from "../structures/database";
import { LoggingConfig, NotificationConfig } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild, EmbedBuilder } from "discord.js";
import { ErrorReasons } from "../data/enums/reasons";

/**
 *    @class
 *    Creates a new instance of the NotificationService.
 */
class NotificationService {
  readonly database;

  constructor() {
    this.database = new Database();
  }

  public async getNotificationConfig(
    guild: DiscordGuild
  ): Promise<NotificationConfig | null> {
    return await this.database.notificationConfig.findFirst({
      where: { guildId: guild.id },
    });
  }

  public async createNotificationConfig(
    guild: DiscordGuild,
    channel: string | null,
    enabled: boolean
  ): Promise<NotificationConfig> {
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

  public async updateNotificationConfig(
    guild: DiscordGuild,
    channel: string | null,
    enabled: boolean
  ): Promise<NotificationConfig> {
    return this.database.notificationConfig.update({
      where: { guildId: guild.id },
      data: {
        channel: channel,
        enabled: enabled,
      },
    });
  }

  public async getNotificationChannel(
    guild: DiscordGuild
  ): Promise<TextChannel | undefined> {
    const config = await this.getNotificationConfig(guild);

    if (config && config.channel) {
      const channel = await guild.channels.fetch(config.channel);

      if (channel instanceof TextChannel) {
        return channel;
      }
    }
  }

  public async sendNotificationMessage(
    guild: DiscordGuild,
    embed: EmbedBuilder
  ) {
    const notificationConfig = await this.getNotificationConfig(guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel = await this.getNotificationChannel(guild);

      await notificationChannel?.send({ embeds: [embed] });
    }
  }
}
export default NotificationService;
