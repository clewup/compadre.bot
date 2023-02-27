import { Event } from "../structures/event";
import { Events } from "discord.js";
import config from "../config";

/**
 *    @name ready
 *    @description Emitted whenever the client is ready/active.
 */
export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.logger.logInfo(
      `${config.clientName} is online and serving ${client.users.cache.size} user(s).`
    );
  },
});
