import { Guild, User } from "discord.js";

class Functions {
  public randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public getGuildString(guild: Guild) {
    return `${guild.name} (${guild.id})`;
  }

  public getUserString(user: User) {
    return `${user.username} (${user.id})`;
  }
}
export default Functions;
