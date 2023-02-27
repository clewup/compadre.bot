import { Event } from "../structures/event";
import {  Events } from "discord.js";

/**
 *    @name guildMemberUpdate
 *    @description Emitted whenever a guild becomes unavailable (eg. server outage).
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
