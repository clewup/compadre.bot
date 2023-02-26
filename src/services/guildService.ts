import Database from "../base/database";
import { Guild } from "@prisma/client";
import { Guild as DiscordGuild } from "discord.js";
import RoleService from "./roleService";
import MemberService from "./memberService";

class GuildService {
  private database;
  private roleService;
  private memberService;

  constructor() {
    this.database = new Database();
    this.roleService = new RoleService();
    this.memberService = new MemberService();
  }

  public async getGuild(id: string): Promise<Guild | null> {
    return await this.database.guild.findFirst({ where: { id: id } });
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
            spam: false,
            ads: false,
            enabled: false,
          },
        },
      },
    });

    const members = await guild.members.list();
    members.forEach(async (member) => {
      await this.memberService.createMember(member);
    });

    const roles = await guild.roles.valueOf();
    roles.forEach(async (role) => {
      await this.roleService.createRole(role);
    });

    return (await this.getGuild(guild.id))!;
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
