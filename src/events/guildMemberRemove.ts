import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";
import UserService from "../services/userService";
import NotificationConfigService from "../services/notificationConfigService";

/*
 *    Emitted whenever a user leaves a guild or is kicked.
 *    Deletes the user from the database.
 */
export default new Event({
  name: Events.GuildMemberRemove,
  async execute(member) {
    const userService = new UserService();
    const notificationConfigService = new NotificationConfigService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${member.displayName} has left the server.`)
      .setThumbnail(member.avatar);

    await userService.deleteUser(member.user);

    const notificationChannel =
      await notificationConfigService.getNotificationChannel(member.guild);
    await notificationChannel?.send({ embeds: [embed] });
  },
});
