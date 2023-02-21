import { Event } from "../base/event";
import { Events } from "discord.js";

/*
 *    Emitted whenever a message is deleted.
 */
export default new Event({
  name: Events.MessageDelete,
  async execute(message) {
    if (message.author?.bot) return;
    if (message.content?.startsWith("/")) return;
  },
});
