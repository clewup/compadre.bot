import Database from "../structures/database";
import { Role as DiscordRole } from "discord.js";
import { Role } from "@prisma/client";

export default class RoleRepository {
  private readonly database;

  constructor(database: Database) {
    this.database = database;
  }

  async get(role: DiscordRole) {
    return await this.database.role.findFirst({ where: { id: role.id } });
  }

  async create(role: DiscordRole) {
    return await this.database.role.create({
      data: {
        id: role.id,
        name: role.name,
        guild: {
          connect: {
            id: role.guild.id,
          },
        },
      },
    });
  }

  async update(role: DiscordRole) {
    return await this.database.role.update({
      where: { id: role.id },
      data: {
        name: role.name,
      },
    });
  }

  async delete(role: DiscordRole) {
    await this.database.role.delete({ where: { id: role.id } });
  }
}
