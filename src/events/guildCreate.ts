import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";
import NotificationService from "../services/notificationService";

/**
 *    @name guildCreate
 *    @description Emitted whenever the bot is added to a guild.
 */
export default new Event({
  name: Events.GuildCreate,
  async execute(guild) {
    const guildService = new GuildService();
    const notificationService = new NotificationService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`Hello! Thanks for adding me to ${guild.name}`)
      .setDescription("To get started, type '/help'.");

    // [Logging]
    guild.client.logger.logInfo(
      `${
        guild.client.user.username
      } has been added to ${guild.client.functions.getGuildString(guild)}.`
    );

    // [Database]: Update the database.
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

    // [Notification]: Send the notification.
    const notificationConfig =
      await notificationService.getNotificationConfig(guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationService.getNotificationChannel(guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
