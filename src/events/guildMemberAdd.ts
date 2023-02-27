import { Event } from "../structures/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import NotificationConfigService from "../services/notificationConfigService";
import MemberService from "../services/memberService";

/*
 *    Emitted whenever a user joins a guild.
 */
export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    const notificationConfigService = new NotificationConfigService();
    const memberService = new MemberService();

    // [Logging]
    member.client.logger.logInfo(
      `${member.client.functions.getUserString(
        member.user
      )} has joined ${member.client.functions.getGuildString(member.guild)}.`
    );

    const existingMember = await memberService.getMember(member.id);
    if (!existingMember) {
      await memberService.createMember(member);
    }

    // [Notification]: Send the notification.
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${member.displayName} has joined the server.`)
      .setThumbnail(member.avatar);

    const notificationConfig =
      await notificationConfigService.getNotificationConfig(member.guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationConfigService.getNotificationChannel(member.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
