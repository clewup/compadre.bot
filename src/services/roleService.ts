import Database from "../base/database";
import { Role } from "@prisma/client";
import { Role as DiscordRole } from "discord.js";

class RoleService {
  private database;

  constructor() {
    this.database = new Database();
  }

  public async getRole(id: string): Promise<Role | null> {
    return await this.database.role.findFirst({ where: { id: id } });
  }

  public async createRole(role: DiscordRole): Promise<Role> {
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

  public async updateRole(role: DiscordRole): Promise<Role> {
    return await this.database.role.update({
      where: { id: role.id },
      data: {
        name: role.name,
      },
    });
  }

  public async deleteRole(role: DiscordRole): Promise<void> {
    await this.database.role.delete({ where: { id: role.id } });
  }
}
export default RoleService;
