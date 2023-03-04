import { Event } from "../structures/event";
import { Events } from "discord.js";

/**
 *    @name guildDelete
 *    @description Emitted whenever the bot is removed from a guild.
 */
export default new Event({
  name: Events.GuildDelete,
  async execute(guild) {
    guild.client.logger.logInfo(
      `${
        guild.client.user.username
      } has been removed from ${guild.client.functions.getGuildString(guild)}.`
    );

    const guildService = guild.client.services.guildService;
    await guildService.deleteGuild(guild);
  },
});
