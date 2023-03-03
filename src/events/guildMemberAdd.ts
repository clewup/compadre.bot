import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  Embed,
  EmbedBuilder,
  Events,
  GuildBan,
  GuildMember,
  TextChannel,
} from "discord.js";
import NotificationService from "../services/notificationService";
import MemberService from "../services/memberService";
import LoggingService from "../services/loggingService";

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

    // [GuildLogging]
    await handleGuildLogging(member);

    // [Notification]: Send the notification.
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${member.displayName} has joined the server.`)
      .setThumbnail(member.avatar);

    const notificationConfig = await notificationService.getNotificationConfig(
      member.guild
    );
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationService.getNotificationChannel(member.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});

const handleGuildLogging = async (member: GuildMember) => {
  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**New User**")
    .addFields([
      {
        name: "User",
        value: `${member.client.functions.getUserString(member.user)}`,
      },
    ])
    .setFooter({ text: `${new Date().toISOString()}` });

  // Send the logs
  const loggingService = new LoggingService();
  const loggingConfig = await loggingService.getLoggingConfig(member.guild);
  if (loggingConfig?.enabled === true) {
    const loggingChannel = await loggingService.getLoggingChannel(member.guild);
    await loggingChannel?.send({
      embeds: [loggingEmbed],
    });
  }
};
