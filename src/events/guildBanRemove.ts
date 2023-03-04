import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
} from "discord.js";

/**
 *    @name guildBanRemove
 *    @description Emitted whenever a user is unbanned from a guild.
 */
export default new Event({
  name: Events.GuildBanRemove,
  async execute(guildBan) {
    guildBan.client.logger.logInfo(
      `${guildBan.client.functions.getUserString(
        guildBan.user
      )} has been unbanned from ${guildBan.client.functions.getGuildString(
        guildBan.guild
      )}.`
    );

    await handleGuildLogging(guildBan);
    await handleGuildNotification(guildBan);
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

  const loggingService = guildBan.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**User Unbanned**", [
    {
      name: "Unbanned User",
      value: `${guildBan.client.functions.getUserMentionString(guildBan.user)}`,
    },
    {
      name: "Unbanned By",
      value: `${
        unbannedBy
          ? guildBan.client.functions.getUserMentionString(unbannedBy)
          : "Unknown"
      }`,
    },
    {
      name: "Reason",
      value: `${guildBan.reason}`,
    },
  ]);
  await loggingService.sendLoggingMessage(guildBan.guild, embed);
};

const handleGuildNotification = async (guildBan: GuildBan) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle(`${guildBan.user.username} has been unbanned from the server.`)
    .setThumbnail(guildBan.user.avatar);

  const notificationService = guildBan.client.services.notificationService;
  await notificationService.sendNotificationMessage(guildBan.guild, embed);
};
