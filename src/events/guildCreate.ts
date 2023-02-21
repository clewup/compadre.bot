import { Event } from "../base/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";

export default new Event({
  name: Events.GuildCreate,
  async execute(guild) {
    const guildService = new GuildService();

    guild.client.logger.logInfo(
      `${guild.client.user.username} has been added to ${guild.name}.`
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`Hello! Thanks for adding me to ${guild.name}`)
      .setDescription("To get started, type '/help'.");

    const notificationChannel = await guildService.getNotificationChannel(
      guild
    );

    const existingGuild = await guildService.getGuild(guild.id);
    if (!existingGuild) {
      await guildService.createGuild(guild);
    }
    if (
      existingGuild &&
      (existingGuild.name !== guild.name ||
        existingGuild.ownerId !== guild.ownerId ||
        existingGuild.memberCount !== guild.memberCount)
    ) {
      await guildService.updateGuild(guild);
    }

    await notificationChannel.send({ embeds: [embed] });
  },
});
