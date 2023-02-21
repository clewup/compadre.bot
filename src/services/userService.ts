import Database from "../base/database";
import { User } from "@prisma/client";
import { User as DiscordUser } from "discord.js";
import config from "../config";

interface IUserService {
  getUser: (id: string) => Promise<User | null>;
  createUser: (user: DiscordUser) => Promise<User>;
  updateUser: (user: DiscordUser) => Promise<User>;
  deleteUser: (user: DiscordUser) => Promise<void>;
}

class UserService implements IUserService {
  private database;

  constructor() {
    this.database = new Database();
  }

  public async getUser(id: string): Promise<User | null> {
    return await this.database.user.findFirst({ where: { id: id } });
  }

  public async createUser(user: DiscordUser): Promise<User> {
    return await this.database.user.create({
      data: {
        id: user.id,
        bot: user.bot,
        username: user.username,
        discriminator: user.discriminator,
        clientAdmin: config.clientAdmins.includes(user.id),
      },
    });
  }

  public async updateUser(user: DiscordUser): Promise<User> {
    return await this.database.user.update({
      where: { id: user.id },
      data: {
        bot: user.bot,
        username: user.username,
        discriminator: user.discriminator,
        clientAdmin: config.clientAdmins.includes(user.id),
      },
    });
  }

  public async deleteUser(user: DiscordUser): Promise<void> {
    await this.database.user.delete({ where: { id: user.id } });
  }
}
export default UserService;
