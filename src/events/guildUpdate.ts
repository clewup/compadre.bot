import { Event } from "../structures/event";
import { Events } from "discord.js";

/**
 *    @name guildUpdate
 *    @description Emitted whenever a guild is updated (eg. name change).
 */
export default new Event({
  name: Events.GuildUpdate,
  async execute(guild) {
    guild.client.logger.logInfo(
      `${guild.client.functions.getGuildString(guild)} has been updated.`
    );

    const guildService = guild.client.services.guildService;
    await guildService.updateGuild(guild);
  },
});
