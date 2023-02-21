import { Event } from "../base/event";
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

    const notificationChannel =
      await notificationConfigService.getNotificationChannel(guildBan.guild);
    await notificationChannel?.send({ embeds: [embed] });
  },
});
