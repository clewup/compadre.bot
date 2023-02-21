import { Event } from "../base/event";
import { Events, User } from "discord.js";
import UserService from "../services/userService";

/*
 *    Emitted whenever a user is updated (eg. username).
 *    Updates the user in the database.
 */
export default new Event({
  name: Events.UserUpdate,
  async execute(user) {
    const userService = new UserService();

    await userService.updateUser(user as User);
  },
});
