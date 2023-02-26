import Database from "../structures/database";
import { PreventConfig } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild } from "discord.js";

class PreventConfigService {
  private database;

  constructor() {
    this.database = new Database();
  }

  public async getPreventConfig(
    guild: DiscordGuild
  ): Promise<PreventConfig | null> {
    return await this.database.preventConfig.findFirst({
      where: { guildId: guild.id },
    });
  }

  public async updatePreventConfig(
    guild: DiscordGuild,
    role: string | null,
    links: boolean,
    spam: boolean,
    ads: boolean,
    enabled: boolean
  ): Promise<PreventConfig> {
    return this.database.preventConfig.update({
      where: { guildId: guild.id },
      data: {
        role: role,
        links: links,
        spam: spam,
        ads: ads,
        enabled: enabled,
      },
    });
  }
}
export default PreventConfigService;
