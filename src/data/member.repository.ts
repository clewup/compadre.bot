import Database from "../structures/database";
import {
  GuildMember as DiscordMember,
  PartialGuildMember as PartialDiscordMember,
  PermissionsBitField,
} from "discord.js";
import config from "../config";

export default class MemberRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async getAll(guildId: string) {
    return await this.database.member.findMany({ where: { guildId: guildId } });
  }

  async get(id: string) {
    return await this.database.member.findFirst({ where: { id: id } });
  }

  async create(member: DiscordMember) {
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

  async update(member: DiscordMember) {
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

  async delete(member: DiscordMember | PartialDiscordMember) {
    await this.database.member.delete({ where: { id: member.id } });
  }
}
