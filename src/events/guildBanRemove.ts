import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
} from "discord.js";
import { loggingService, notificationService } from "../services";
import { logger } from "../helpers";

/**
 *    @name guildBanRemove
 *    @description Emitted whenever a user is unbanned from a guild.
 */
export default new Event({
  name: Events.GuildBanRemove,
  async execute(guildBan) {
    logger.info(
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

  const embed = await loggingService.createEmbed("**User Unbanned**", [
    {
      name: "Unbanned User",
      value: `${guildBan.client.functions.getUserMentionString(guildBan.user)}`,
      inline: false,
    },
    {
      name: "Unbanned By",
      value: `${
        unbannedBy
          ? guildBan.client.functions.getUserMentionString(unbannedBy)
          : "Unknown"
      }`,
      inline: false,
    },
    {
      name: "Reason",
      value: `${guildBan.reason}`,
      inline: false,
    },
  ]);
  await loggingService.send(guildBan.guild, embed);
};

const handleGuildNotification = async (guildBan: GuildBan) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle(`${guildBan.user.username} has been unbanned from the server.`)
    .setThumbnail(guildBan.user.avatar);

  await notificationService.send(guildBan.guild, embed);
};
