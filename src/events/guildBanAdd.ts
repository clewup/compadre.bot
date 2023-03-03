import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
  TextChannel,
} from "discord.js";
import NotificationService from "../services/notificationService";
import LoggingService from "../services/loggingService";

/**
 *    @name guildBanAdd
 *    @description Emitted whenever a user is banned from a guild.
 */
export default new Event({
  name: Events.GuildBanAdd,
  async execute(guildBan) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle(`${guildBan.user.username} has been banned from the server.`)
      .setThumbnail(guildBan.user.avatar);

    // [Logging]
    guildBan.client.logger.logInfo(
      `${guildBan.client.functions.getUserString(
        guildBan.user
      )} has been banned from ${guildBan.client.functions.getGuildString(
        guildBan.guild
      )}.`
    );

    // [GuildLogging]
    await handleGuildLogging(guildBan);

    // [Notification]: Send the notification.
    const notificationService = new NotificationService();
    const notificationConfig = await notificationService.getNotificationConfig(
      guildBan.guild
    );
    if (notificationConfig?.enabled === true) {
      const notificationChannel =
        await notificationService.getNotificationChannel(guildBan.guild);
      await notificationChannel?.send({ embeds: [embed] });
    }
  },
});

const handleGuildLogging = async (guildBan: GuildBan) => {
  // Fetch the user who banned the user
  const fetchedLogs = await guildBan.guild!.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanAdd,
  });
  const banLog = fetchedLogs.entries.first();
  let bannedBy = null;
  if (banLog && banLog.target?.id === guildBan.user?.id && banLog.executor) {
    bannedBy = banLog.executor;
  }

  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**User Banned**")
    .addFields([
      {
        name: "Banned User",
        value: `${guildBan.client.functions.getUserString(guildBan.user)}`,
      },
      {
        name: "Banned By",
        value: `${
          bannedBy
            ? guildBan.client.functions.getUserString(bannedBy)
            : "Unknown"
        }`,
      },
      {
        name: "Reason",
        value: `${guildBan.reason}`,
      },
    ])
    .setFooter({ text: `${new Date().toISOString()}` });

  // Send the logs
  const loggingService = new LoggingService();
  const loggingConfig = await loggingService.getLoggingConfig(guildBan.guild);
  if (loggingConfig?.enabled === true) {
    const loggingChannel = await loggingService.getLoggingChannel(
      guildBan.guild
    );
    await loggingChannel?.send({
      embeds: [loggingEmbed],
    });
  }
};
