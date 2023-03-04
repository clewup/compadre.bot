import { Guild, PartialUser, User } from "discord.js";

/**
 *    @class
 *    Creates a new instance of Functions.
 */
class Functions {
  public randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public randomArrayItem(array: any[]) {
    const randomIndex = this.randomNumber(0, array.length);
    return array[randomIndex];
  }

  public getGuildString(guild: Guild) {
    return `${guild.name} (${guild.id})`;
  }

  public getUserString(user: User | PartialUser) {
    return `${user.username} (${user.id})`;
  }

  public getUserMentionString(user: User | PartialUser) {
    return `${user} (${user.id})`;
  }
}
export default Functions;
