import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever the bot is removed from a guild.
 */
export default new Event({
  name: Events.GuildDelete,
  async execute(guild) {
    const guildService = new GuildService();

    // [Logging]
    guild.client.logger.logInfo(
      `${
        guild.client.user.username
      } has been removed from ${guild.client.functions.getGuildString(guild)}.`
    );

    // [Database]: Update the database.
    await guildService.deleteGuild(guild);
  },
});
