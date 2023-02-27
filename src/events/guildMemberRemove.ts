import { Event } from "../structures/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import NotificationService from "../services/notificationService";
import MemberService from "../services/memberService";

/**
 *    @name guildMemberRemove
 *    @description Emitted whenever a user leaves a guild or is kicked.
 */
export default new Event({
  name: Events.GuildMemberRemove,
  async execute(member) {
    const memberService = new MemberService();
    const notificationService = new NotificationService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${member.displayName} has left the server.`)
      .setThumbnail(member.avatar);

    // [Logging]
    member.client.logger.logInfo(
      `${member.client.functions.getUserString(
        member.user
      )} has left/been kicked from ${member.client.functions.getGuildString(
        member.guild
      )}.`
    );

    // [Database]: Update the database.
    await memberService.deleteMember(member);

    // [Notification]: Send the notification.
    const notificationConfig =
      await notificationService.getNotificationConfig(member.guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationService.getNotificationChannel(member.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
