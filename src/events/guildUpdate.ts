import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever a guild is updated (eg. name change).
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
