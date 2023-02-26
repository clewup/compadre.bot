import { Event } from "../structures/event";
import { Events, User } from "discord.js";

/*
 *    Emitted whenever a user is updated (eg. username).
 */
export default new Event({
  name: Events.UserUpdate,
  async execute(user) {
    // [Logging]
    user.client.logger.logInfo(
      `${user.client.functions.getUserString(
        user
      )} has updated their credentials.`
    );
  },
});
