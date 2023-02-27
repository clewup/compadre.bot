import { Event } from "../structures/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import NotificationService from "../services/notificationService";
import MemberService from "../services/memberService";

/**
 *    @name guildMemberAdd
 *    @description Emitted whenever a user joins a guild.
 */
export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    const notificationService = new NotificationService();
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
      await notificationService.getNotificationConfig(member.guild);
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationService.getNotificationChannel(member.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});
