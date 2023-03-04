import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildBan,
  GuildMember,
  PartialGuildMember,
} from "discord.js";

/**
 *    @name guildMemberRemove
 *    @description Emitted whenever a user leaves a guild or is kicked.
 */
export default new Event({
  name: Events.GuildMemberRemove,
  async execute(member) {
    member.client.logger.logInfo(
      `${member.client.functions.getUserString(
        member.user
      )} has left/been kicked from ${member.client.functions.getGuildString(
        member.guild
      )}.`
    );

    const memberService = member.client.services.memberService;
    await memberService.deleteMember(member);

    await handleGuildLogging(member);
    await handleGuildNotification(member);
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

  const loggingService = member.client.services.loggingService;

  if (kickedBy) {
    const embed = await loggingService.createLoggingEmbed("**User Kicked**", [
      {
        name: "User",
        value: `${member.client.functions.getUserMentionString(member.user)}`,
      },
      {
        name: "Kicked By",
        value: `${
          kickedBy
            ? member.client.functions.getUserMentionString(kickedBy)
            : "Unknown"
        }`,
      },
    ]);
    await loggingService.sendLoggingMessage(member.guild, embed);
  } else {
    const embed = await loggingService.createLoggingEmbed("**User Left**", [
      {
        name: "User",
        value: `${member.client.functions.getUserMentionString(member.user)}`,
      },
    ]);
    await loggingService.sendLoggingMessage(member.guild, embed);
  }
};

const handleGuildNotification = async (
  member: GuildMember | PartialGuildMember
) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle(`${member.displayName} has left the server.`)
    .setThumbnail(member.avatar);

  const notificationService = member.client.services.notificationService;
  await notificationService.sendNotificationMessage(member.guild, embed);
};
