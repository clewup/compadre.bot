import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
} from "discord.js";

/**
 *    @name guildBanAdd
 *    @description Emitted whenever a user is banned from a guild.
 */
export default new Event({
  name: Events.GuildBanAdd,
  async execute(guildBan) {
    guildBan.client.logger.logInfo(
      `${guildBan.client.functions.getUserString(
        guildBan.user
      )} has been banned from ${guildBan.client.functions.getGuildString(
        guildBan.guild
      )}.`
    );

    await handleGuildLogging(guildBan);
    await handleGuildNotification(guildBan);
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

  const loggingService = guildBan.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**User Banned**", [
    {
      name: "Banned User",
      value: `${guildBan.client.functions.getUserMentionString(guildBan.user)}`,
    },
    {
      name: "Banned By",
      value: `${
        bannedBy
          ? guildBan.client.functions.getUserMentionString(bannedBy)
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
    .setColor(Colors.Red)
    .setTitle(`${guildBan.user.username} has been banned from the server.`)
    .setThumbnail(guildBan.user.avatar);

  const notificationService = guildBan.client.services.notificationService;
  await notificationService.sendNotificationMessage(guildBan.guild, embed);
};
