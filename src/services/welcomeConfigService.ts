import Database from "../base/database";
import { WelcomeConfig } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild } from "discord.js";

class WelcomeConfigService {
  private database;

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
export default WelcomeConfigService;
