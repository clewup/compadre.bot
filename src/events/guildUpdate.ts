import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

export default new Event({
  name: Events.GuildUpdate,
  async execute(guild) {
    const guildService = new GuildService();

    await guildService.updateGuild(guild);
  },
});
