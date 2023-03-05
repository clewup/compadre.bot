import { Guild, PartialUser, User } from "discord.js";

/**
 *    @class
 *    Creates a new instance of Functions.
 */
export default class Functions {
  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomArrayItem(array: any[]) {
    const randomIndex = this.randomNumber(0, array.length);
    return array[randomIndex];
  }

  getGuildString(guild: Guild) {
    return `${guild.name} (${guild.id})`;
  }

  getUserString(user: User | PartialUser) {
    return `${user.username} (${user.id})`;
  }

  getUserMentionString(user: User | PartialUser) {
    return `${user} (${user.id})`;
  }

  formatApiError(message: unknown) {
    return {
      error: true,
      message: message,
    };
  }
}
