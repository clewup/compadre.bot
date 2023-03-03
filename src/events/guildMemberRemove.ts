import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  Embed,
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import NotificationService from "../services/notificationService";
import MemberService from "../services/memberService";
import LoggingService from "../services/loggingService";

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

    // [GuildLogging]
    await handleGuildLogging(member);

    // [Database]: Update the database.
    await memberService.deleteMember(member);

    // [Notification]: Send the notification.
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

const handleGuildLogging = async (member: GuildMember | PartialGuildMember) => {
  // Fetch the user who kicked the user
  const fetchedLogs = await member.guild!.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberKick,
  });
  const kickLog = fetchedLogs.entries.first();
  let kickedBy = null;
  if (kickLog && kickLog.target?.id === member.user?.id && kickLog.executor) {
    kickedBy = kickLog.executor;
  }

  // Create the embed
  let loggingEmbed = new EmbedBuilder();
  if (kickedBy) {
    loggingEmbed = new EmbedBuilder()
      .setTitle("**User Kicked**")
      .addFields([
        {
          name: "User",
          value: `${member.client.functions.getUserString(member.user)}`,
        },
        {
          name: "Kicked By",
          value: `${
            kickedBy
              ? member.client.functions.getUserString(kickedBy)
              : "Unknown"
          }`,
        },
      ])
      .setFooter({ text: `${new Date().toISOString()}` });
  } else {
    loggingEmbed = new EmbedBuilder()
      .setTitle("**User Left**")
      .addFields([
        {
          name: "User",
          value: `${member.client.functions.getUserString(member.user)}`,
        },
      ])
      .setFooter({ text: `${new Date().toISOString()}` });
  }

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
