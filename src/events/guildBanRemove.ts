import { Event } from "../structures/event";
import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";
import NotificationConfigService from "../services/notificationConfigService";

/*
 *    Emitted whenever a user is unbanned from a guild.
 */
export default new Event({
  name: Events.GuildBanRemove,
  async execute(guildBan) {
    const notificationConfigService = new NotificationConfigService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${guildBan.user.username} has been unbanned from the server.`)
      .setThumbnail(guildBan.user.avatar);

    // [Logging]
    guildBan.client.logger.logInfo(
      `${guildBan.client.functions.getUserString(
        guildBan.user
      )} has been unbanned from ${guildBan.client.functions.getGuildString(
        guildBan.guild
      )}.`
    );

    // [Notification]: Send the notification.
    const notificationConfig =
      await notificationConfigService.getNotificationConfig(guildBan.guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationConfigService.getNotificationChannel(guildBan.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
