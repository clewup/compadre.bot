import Database from "../structures/database";
import { Member } from "@prisma/client";
import {
  GuildMember as DiscordMember,
  PartialGuildMember as PartialDiscordMember,
  PermissionsBitField,
} from "discord.js";
import config from "../config";

/**
 *    @class
 *    Creates a new instance of the MemberService.
 */
class MemberService {
  readonly database;

  constructor() {
    this.database = new Database();
  }

  public async getMember(member: DiscordMember): Promise<Member | null> {
    return await this.database.member.findFirst({ where: { id: member.id } });
  }

  public async createMember(member: DiscordMember): Promise<Member> {
    return await this.database.member.create({
      data: {
        id: member.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        guildAdmin: member.permissions.has(
          PermissionsBitField.Flags.Administrator
        ),
        clientAdmin: config.clientAdmins.includes(member.id),
        guild: {
          connect: {
            id: member.guild.id,
          },
        },
      },
    });
  }

  public async updateMember(member: DiscordMember): Promise<Member> {
    return await this.database.member.update({
      where: { id: member.id },
      data: {
        username: member.user.username,
        discriminator: member.user.discriminator,
        guildAdmin: member.permissions.has(
          PermissionsBitField.Flags.Administrator
        ),
        clientAdmin: config.clientAdmins.includes(member.id),
      },
    });
  }

  public async deleteMember(
    member: DiscordMember | PartialDiscordMember
  ): Promise<void> {
    await this.database.member.delete({ where: { id: member.id } });
  }
}
export default MemberService;
