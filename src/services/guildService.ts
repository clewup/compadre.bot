import Database from "../base/database";
import { Guild } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild } from "discord.js";
import NotificationConfigService from "./notificationConfigService";

class GuildService {
  private database;
  private notificationConfigService;

  constructor() {
    this.database = new Database();
    this.notificationConfigService = new NotificationConfigService();
  }

  public async getGuild(id: string): Promise<Guild | null> {
    return await this.database.guild.findFirst({ where: { id: id } });
  }

  public async createGuild(guild: DiscordGuild): Promise<Guild> {
    let generalChannel = guild.channels.cache
      .filter((x) => (x as TextChannel).name === "general")
      .first();
    if (!generalChannel) {
      generalChannel = guild.channels.cache
        .filter((x) => x.isTextBased)
        .first()!;
    }

    return this.database.guild.create({
      data: {
        // Properties
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,

        // Relations
        notificationConfig: {
          create: {
            channel: generalChannel.id,
            enabled: true,
          },
        },
        welcomeConfig: {
          create: {
            channel: null,
            role: null,
            enabled: false,
          },
        },
      },
    });
  }

  public async updateGuild(guild: DiscordGuild): Promise<Guild> {
    return this.database.guild.update({
      where: { id: guild.id },
      data: {
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,
      },
    });
  }

  public async deleteGuild(guild: DiscordGuild): Promise<void> {
    await this.database.guild.delete({ where: { id: guild.id } });
  }
}
export default GuildService;
