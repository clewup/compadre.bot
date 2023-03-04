import { Event } from "../structures/event";
import { Events } from "discord.js";

/**
 *    @name userUpdate
 *    @description Emitted whenever a user is updated (eg. username).
 */
export default new Event({
  name: Events.UserUpdate,
  async execute(user) {
    user.client.logger.logInfo(
      `${user.client.functions.getUserString(
        user
      )} has updated their credentials.`
    );
  },
});
