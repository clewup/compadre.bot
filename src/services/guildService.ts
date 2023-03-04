import Database from "../structures/database";
import { Guild } from "@prisma/client";
import { Guild as DiscordGuild } from "discord.js";

/**
 *    @class
 *    Creates a new instance of the GuildService.
 */
class GuildService {
  readonly database;

  constructor() {
    this.database = new Database();
  }

  public async getGuild(guild: DiscordGuild): Promise<Guild | null> {
    return await this.database.guild.findFirst({ where: { id: guild.id } });
  }

  public async createGuild(guild: DiscordGuild): Promise<Guild> {
    await this.database.guild.create({
      data: {
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        joinedTimestamp: guild.joinedTimestamp,
        maximumMembers: guild.maximumMembers,
        preferredLocale: guild.preferredLocale,

        // Default Configuration
        notificationConfig: {
          create: {
            channel: null,
            enabled: false,
          },
        },
        loggingConfig: {
          create: {
            channel: null,
            role: null,
            enabled: false,
          },
        },
        welcomeConfig: {
          create: {
            channel: null,
            role: null,
            message: null,
            enabled: false,
          },
        },
        preventConfig: {
          create: {
            role: null,
            links: false,
            enabled: false,
          },
        },
      },
    });

    const memberService = guild.client.services.memberService;
    const members = await guild.members.list();
    members.forEach(async (member) => {
      await memberService.createMember(member);
    });

    const roleService = guild.client.services.roleService;
    const roles = await guild.roles.valueOf();
    roles.forEach(async (role) => {
      await roleService.createRole(role);
    });

    return (await this.getGuild(guild))!;
  }

  public async updateGuild(guild: DiscordGuild): Promise<Guild> {
    return await this.database.guild.update({
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
