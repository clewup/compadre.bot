import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import NotificationConfigService from "../services/notificationConfigService";
import MemberService from "../services/memberService";

/*
 *    Emitted whenever a user leaves a guild or is kicked.
 */
export default new Event({
  name: Events.GuildMemberRemove,
  async execute(member) {
    const memberService = new MemberService();
    const notificationConfigService = new NotificationConfigService();

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
      await notificationConfigService.getNotificationConfig(member.guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationConfigService.getNotificationChannel(member.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
