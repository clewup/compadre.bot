import User, { IUser } from "../models/user";

interface IUserManager {
  getUser: (id: string) => Promise<User | null>;
  createUser: (user: IUser) => Promise<User>;
}

class UserManager implements IUserManager {
  public async getUser(id: string): Promise<User | null> {
    return await User.findOne({ where: { id: id } });
  }

  public async createUser(user: IUser): Promise<User> {
    return await new User({
      id: user.id,
      bot: user.bot,
      username: user.username,
      discriminator: user.discriminator,
    }).save();
  }
}
export default UserManager;
