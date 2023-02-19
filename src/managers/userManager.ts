import Database from "../base/database";
import { User } from "@prisma/client";

interface IUserManager {
  getUser: (id: string) => Promise<User | null>;
  createUser: (user: User) => Promise<User>;
}

class UserManager implements IUserManager {
  private database;

  constructor() {
    this.database = new Database();
  }

  public async getUser(id: string): Promise<User | null> {
    return await this.database.user.findFirst({ where: { id: id } });
  }

  public async createUser(user: User): Promise<User> {
    return this.database.user.create({
      data: {
        id: user.id,
        bot: user.bot,
        username: user.username,
        discriminator: user.discriminator,
      },
    });
  }
}
export default UserManager;
