import { Event } from "../structures/event";
import { Events } from "discord.js";
import { functions, logger } from "../helpers";

/**
 *    @name userUpdate
 *    @description Emitted whenever a user is updated (eg. username).
 */
export default new Event({
  name: Events.UserUpdate,
  async execute(user) {
    logger.info(
      `${functions.getUserString(user)} has updated their credentials.`
    );
  },
});
