import Database from "../base/database";
import { User } from "@prisma/client";
import config from "../config";

interface IUserService {
  getUser: (id: string) => Promise<User | null>;
  createUser: (user: User) => Promise<User>;
}

class UserService implements IUserService {
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
        clientAdmin: config.clientAdmins.includes(user.id),
      },
    });
  }
}
export default UserService;
