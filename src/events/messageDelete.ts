import { Event } from "../structures/event";
import { Events } from "discord.js";

/**
 *    @name messageDelete
 *    @description Emitted whenever a message is deleted.
 */
export default new Event({
  name: Events.MessageDelete,
  async execute(message) {
    if (message.author?.bot) return;
    if (message.content?.startsWith("/")) return;

    // [Logging]
    message.client.logger.logInfo(
      `The message "${
        message.content
      }" has been deleted in ${message.client.functions.getGuildString(
        message.guild
      )}.`
    );
  },
});
