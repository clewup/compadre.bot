import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

/*
 *    Emitted whenever a guild is updated (eg. name change).
 *    Updates the guild in the database.
 */
export default new Event({
  name: Events.GuildUpdate,
  async execute(guild) {
    const guildService = new GuildService();

    await guildService.updateGuild(guild);
  },
});
