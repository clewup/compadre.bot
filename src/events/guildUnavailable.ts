import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever a guild becomes unavailable (eg. server outage).
 */
export default new Event({
  name: Events.GuildUnavailable,
  async execute(guild) {
    guild.client.logger.logInfo(
      `${guild.client.user.username} is unable to serve ${guild.name}, likely due to a server outage..`
    );
  },
});
