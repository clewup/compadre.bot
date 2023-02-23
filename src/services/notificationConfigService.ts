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
