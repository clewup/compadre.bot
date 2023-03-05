import { Event } from "../structures/event";
import { Events } from "discord.js";
import config from "../config";
import { logger } from "../helpers";

/**
 *    @name ready
 *    @description Emitted whenever the client is ready/active.
 */
export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.info(
      `${config.clientName} is online and serving ${client.users.cache.size} user(s).`
    );
  },
});
