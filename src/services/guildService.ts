import Database from "../base/database";
import { Guild } from "@prisma/client";
import { TextChannel, Guild as DiscordGuild } from "discord.js";

interface IGuildService {
  getGuild: (id: string) => Promise<Guild | null>;
  createGuild: (guild: DiscordGuild) => Promise<Guild>;
}

class GuildService implements IGuildService {
  private database;

  constructor() {
    this.database = new Database();
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
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,
        notificationChannel: generalChannel?.id,
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

  public async getNotificationChannel(
    guild: DiscordGuild
  ): Promise<TextChannel> {
    const existingGuild = await this.getGuild(guild.id);

    return (await guild.channels.fetch(
      existingGuild?.notificationChannel!
    )) as TextChannel;
  }

  public async updateNotificationChannel(
    guild: DiscordGuild,
    notificationChannel: string
  ): Promise<Guild> {
    return this.database.guild.update({
      where: { id: guild.id },
      data: {
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,
        notificationChannel: notificationChannel,
      },
    });
  }
}
export default GuildService;
