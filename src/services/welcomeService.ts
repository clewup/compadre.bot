import Database from "../structures/database";
import { PreventConfig, WelcomeConfig } from "@prisma/client";
import { Guild as DiscordGuild } from "discord.js";

/**
 *    @class
 *    Creates a new instance of the WelcomeService.
 */
class WelcomeService {
  readonly database;

  constructor() {
    this.database = new Database();
  }

  public async getWelcomeConfig(
    guild: DiscordGuild
  ): Promise<WelcomeConfig | null> {
    return await this.database.welcomeConfig.findFirst({
      where: { guildId: guild.id },
    });
  }

  public async createWelcomeConfig(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ): Promise<WelcomeConfig> {
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

  public async updateWelcomeConfig(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string | null,
    enabled: boolean
  ): Promise<WelcomeConfig> {
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
}
export default WelcomeService;
