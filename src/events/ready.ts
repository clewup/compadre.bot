import { Event } from "../base/event";
import { Events } from "discord.js";
import GuildService from "../services/guildService";

export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.logger.logInfo(
      `${client.user?.username} is online and serving ${client.users.cache.size} user(s).`
    );
  },
});
