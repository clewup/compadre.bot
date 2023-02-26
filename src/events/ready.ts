import { Event } from "../structures/event";
import { Events } from "discord.js";
import GuildService from "../services/guildService";
import config from "../config";

/*
 *    Emitted whenever the client is ready/active.
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
