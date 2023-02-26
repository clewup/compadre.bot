import { Event } from "../base/event";
import { Colors, Embed, EmbedBuilder, Events, TextChannel } from "discord.js";
import GuildService from "../services/guildService";
import UserService from "../services/userService";
import NotificationConfigService from "../services/notificationConfigService";
import MemberService from "../services/memberService";

/*
 *    Emitted whenever a user joins a guild.
 */
export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    const userService = new UserService();
    const notificationConfigService = new NotificationConfigService();
    const memberService = new MemberService();

    // [Logging]
    member.client.logger.logInfo(
      `${member.client.functions.getUserString(
        member.user
      )} has joined ${member.client.functions.getGuildString(member.guild)}.`
    );

    // [Database]: Update the database.
    const existingUser = await userService.getUser(member.user.id);
    if (!existingUser) {
      await userService.createUser(member.user);
    } else {
      await userService.updateUser(member.user);
    }

    let existingMember = await memberService.getMember(member.id);
    if (!existingMember) {
      existingMember = await memberService.createMember(member);
    } else {
      existingMember = await memberService.updateMember(member);
    }

    // [Notification]: Send the notification.
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${existingMember.username} has joined the server.`)
      .setDescription(
        `${existingMember.username} had previously joined the server as ${existingMember.stickyUsername}.`
      )
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
