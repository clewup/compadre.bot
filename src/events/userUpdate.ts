import { Event } from "../base/event";
import { Events, User } from "discord.js";
import UserService from "../services/userService";

/*
 *    Emitted whenever a user is updated (eg. username).
 */
export default new Event({
  name: Events.UserUpdate,
  async execute(user) {
    const userService = new UserService();

    // [Logging]
    user.client.logger.logInfo(
      `${user.client.functions.getUserString(
        user
      )} has updated their credentials.`
    );

    // [Database]: Update the database.
    await userService.updateUser(user as User);
  },
});
