import { Event } from "../structures/event";
import { Events } from "discord.js";
import { functions, logger } from "../helpers";

/**
 *    @name guildMemberUpdate
 *    @description Emitted whenever a guild becomes unavailable (eg. server outage).
 */
export default new Event({
  name: Events.GuildUnavailable,
  async execute(guild) {
    logger.info(`${functions.getGuildString(guild)} is unavailable.`);
  },
});
