import Database from "../structures/database";
import { LoggingConfig } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild } from "discord.js";

/**
 *    @class
 *    Creates a new instance of the LoggingService.
 */
class LoggingService {
  private database;

  constructor() {
    this.database = new Database();
  }

  public async getLoggingConfig(
    guild: DiscordGuild
  ): Promise<LoggingConfig | null> {
    return await this.database.loggingConfig.findFirst({
      where: { guildId: guild.id },
    });
  }

  public async updateLoggingConfig(
    guild: DiscordGuild,
    role: string | null,
    channel: string | null,
    enabled: boolean
  ): Promise<LoggingConfig> {
    return this.database.loggingConfig.update({
      where: { guildId: guild.id },
      data: {
        channel: channel,
        role: role,
        enabled: enabled,
      },
    });
  }

  public async getLoggingChannel(
    guild: DiscordGuild
  ): Promise<TextChannel | undefined> {
    const config = await this.getLoggingConfig(guild);

    if (config && config.channel) {
      const channel = await guild.channels.fetch(config.channel);

      if (channel instanceof TextChannel) {
        return channel;
      }
    }
  }
}
export default LoggingService;
