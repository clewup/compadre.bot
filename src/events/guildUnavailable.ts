import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever a guild becomes unavailable (eg. server outage).
 */
export default new Event({
  name: Events.GuildUnavailable,
  async execute(guild) {
    // [Logging]
    guild.client.logger.logInfo(
      `${guild.client.functions.getGuildString(guild)} is unavailable.`
    );
  },
});
