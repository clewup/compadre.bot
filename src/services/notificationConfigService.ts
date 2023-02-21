import Database from "../base/database";
import { NotificationConfig } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild } from "discord.js";

class NotificationConfigService {
  private database;

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
    guild: DiscordGuild
  ): Promise<NotificationConfig> {
    let generalChannel = guild.channels.cache
      .filter((x) => (x as TextChannel).name === "general")
      .first();
    if (!generalChannel) {
      generalChannel = guild.channels.cache
        .filter((x) => x.isTextBased)
        .first()!;
    }

    return this.database.notificationConfig.create({
      data: {
        guildId: guild.id,
        channel: generalChannel?.id,
        enabled: true,
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

  public async deleteNotificationConfig(guild: DiscordGuild): Promise<void> {
    await this.database.notificationConfig.delete({
      where: { guildId: guild.id },
    });
  }

  public async getNotificationChannel(
    guild: DiscordGuild
  ): Promise<TextChannel | null> {
    const config = await this.getNotificationConfig(guild);

    if (config?.channel) {
      return (await guild.channels.fetch(config?.channel!)) as TextChannel;
    } else {
      return null;
    }
  }
}
export default NotificationConfigService;
