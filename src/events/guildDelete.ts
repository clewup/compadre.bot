import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever the bot is removed from a guild.
 *    Deletes the guild from the database.
 */
export default new Event({
  name: Events.GuildDelete,
  async execute(guild) {
    const guildService = new GuildService();

    guild.client.logger.logInfo(
      `${guild.client.user.username} has been removed from ${guild.name}.`
    );

    await guildService.deleteGuild(guild);
  },
});
