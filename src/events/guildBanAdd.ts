import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import NotificationService from "../services/notificationService";

/**
 *    @name guildBanAdd
 *    @description Emitted whenever a user is banned from a guild.
 */
export default new Event({
  name: Events.GuildBanAdd,
  async execute(guildBan) {
    const notificationService = new NotificationService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${guildBan.user.username} has been banned from the server.`)
      .setThumbnail(guildBan.user.avatar);

    // [Logging]
    guildBan.client.logger.logInfo(
      `${guildBan.client.functions.getUserString(
        guildBan.user
      )} has been banned from ${guildBan.client.functions.getGuildString(
        guildBan.guild
      )}.`
    );

    // [Notification]: Send the notification.
    const notificationConfig =
      await notificationService.getNotificationConfig(guildBan.guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationService.getNotificationChannel(guildBan.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
