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

  public async createWelcomeConfig(
    guild: DiscordGuild,
    channel: string,
    role: string,
    message: string
  ): Promise<WelcomeConfig> {
    return this.database.welcomeConfig.create({
      data: {
        guildId: guild.id,
        channel: channel,
        role: role,
        message: message,
        enabled: true,
      },
    });
  }

  public async updateWelcomeConfig(
    guild: DiscordGuild,
    channel: string | null,
    role: string | null,
    message: string,
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

  public async deleteWelcomeConfig(guild: DiscordGuild): Promise<void> {
    await this.database.welcomeConfig.delete({ where: { guildId: guild.id } });
  }

  public async getWelcomeChannel(
    guild: DiscordGuild
  ): Promise<TextChannel | null> {
    const config = await this.getWelcomeConfig(guild);

    if (config?.channel) {
      return (await guild.channels.fetch(config?.channel!)) as TextChannel;
    } else {
      return null;
    }
  }
}
export default WelcomeConfigService;
