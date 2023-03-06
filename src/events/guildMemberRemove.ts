import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
} from "discord.js";
import {
  loggingService,
  memberService,
  notificationService,
} from "../services";
import { logger } from "../helpers";

/**
 *    @name guildMemberRemove
 *    @description Emitted whenever a user leaves a guild or is kicked.
 */
export default new Event({
  name: Events.GuildMemberRemove,
  async execute(member) {
    logger.info(
      `${member.client.functions.getUserString(
        member.user
      )} has left/been kicked from ${member.client.functions.getGuildString(
        member.guild
      )}.`
    );

    await memberService.delete(member);

    await handleGuildLogging(member);
    await handleGuildNotification(member);
  },
});

const handleGuildLogging = async (member: GuildMember | PartialGuildMember) => {
  if (!member.guild) return;

  // Fetch the user who kicked the user
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberKick,
  });
  const kickLog = fetchedLogs.entries.first();
  let kickedBy = null;
  if (kickLog && kickLog.target?.id === member.user?.id && kickLog.executor) {
    kickedBy = kickLog.executor;
  }

  if (kickedBy) {
    const embed = await loggingService.createEmbed("**User Kicked**", [
      {
        name: "User",
        value: `${member.client.functions.getUserMentionString(member.user)}`,
        inline: false,
      },
      {
        name: "Kicked By",
        value: `${
          kickedBy
            ? member.client.functions.getUserMentionString(kickedBy)
            : "Unknown"
        }`,
        inline: false,
      },
    ]);
    await loggingService.send(member.guild, embed);
  } else {
    const embed = await loggingService.createEmbed("**User Left**", [
      {
        name: "User",
        value: `${member.client.functions.getUserMentionString(member.user)}`,
        inline: false,
      },
    ]);
    await loggingService.send(member.guild, embed);
  }
};

const handleGuildNotification = async (
  member: GuildMember | PartialGuildMember
) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle(`${member.displayName} has left the server.`)
    .setThumbnail(member.avatar);

  await notificationService.send(member.guild, embed);
};
