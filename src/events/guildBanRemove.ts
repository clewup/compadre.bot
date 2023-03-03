import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
  TextChannel,
} from "discord.js";
import GuildService from "../services/guildService";
import NotificationService from "../services/notificationService";
import LoggingService from "../services/loggingService";

/**
 *    @name guildBanRemove
 *    @description Emitted whenever a user is unbanned from a guild.
 */
export default new Event({
  name: Events.GuildBanRemove,
  async execute(guildBan) {
    const notificationService = new NotificationService();

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${guildBan.user.username} has been unbanned from the server.`)
      .setThumbnail(guildBan.user.avatar);

    // [Logging]
    guildBan.client.logger.logInfo(
      `${guildBan.client.functions.getUserString(
        guildBan.user
      )} has been unbanned from ${guildBan.client.functions.getGuildString(
        guildBan.guild
      )}.`
    );

    // [GuildLogging]
    await handleGuildLogging(guildBan);

    // [Notification]: Send the notification.
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
  // Fetch the user who unbanned the user
  const fetchedLogs = await guildBan.guild!.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanRemove,
  });
  const banLog = fetchedLogs.entries.first();
  let unbannedBy = null;
  if (banLog && banLog.target?.id === guildBan.user?.id && banLog.executor) {
    unbannedBy = banLog.executor;
  }

  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**User Unbanned**")
    .addFields([
      {
        name: "Unbanned User",
        value: `${guildBan.client.functions.getUserString(guildBan.user)}`,
      },
      {
        name: "Unbanned By",
        value: `${
          unbannedBy
            ? guildBan.client.functions.getUserString(unbannedBy)
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
