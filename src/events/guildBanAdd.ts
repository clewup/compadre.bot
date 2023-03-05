import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
} from "discord.js";
import { loggingService, notificationService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name guildBanAdd
 *    @description Emitted whenever a user is banned from a guild.
 */
export default new Event({
  name: Events.GuildBanAdd,
  async execute(guildBan) {
    logger.info(
      `${functions.getUserString(
        guildBan.user
      )} has been banned from ${functions.getGuildString(guildBan.guild)}.`
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

  const embed = await loggingService.createEmbed("**User Banned**", [
    {
      name: "Banned User",
      value: `${guildBan.client.functions.getUserMentionString(guildBan.user)}`,
      inline: false,
    },
    {
      name: "Banned By",
      value: `${
        bannedBy
          ? guildBan.client.functions.getUserMentionString(bannedBy)
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
    .setColor(Colors.Red)
    .setTitle(`${guildBan.user.username} has been banned from the server.`)
    .setThumbnail(guildBan.user.avatar);

  await notificationService.send(guildBan.guild, embed);
};
