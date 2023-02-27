import { Event } from "../structures/event";
import {  Events } from "discord.js";
import GuildService from "../services/guildService";

/**
 *    @name guildUpdate
 *    @description Emitted whenever a guild is updated (eg. name change).
 */
export default new Event({
  name: Events.GuildUpdate,
  async execute(guild) {
    const guildService = new GuildService();

    // [Logging]
    guild.client.logger.logInfo(
      `${guild.client.functions.getGuildString(guild)} has been updated.`
    );

    // [Database]: Update the database.
    await guildService.updateGuild(guild);
  },
});
