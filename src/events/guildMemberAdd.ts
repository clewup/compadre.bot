import { Event } from "../structures/event";
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
} from "discord.js";

/**
 *    @name guildMemberAdd
 *    @description Emitted whenever a user joins a guild.
 */
export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    member.client.logger.logInfo(
      `${member.client.functions.getUserString(
        member.user
      )} has joined ${member.client.functions.getGuildString(member.guild)}.`
    );

    const memberService = member.client.services.memberService;
    const existingMember = await memberService.getMember(member);
    if (!existingMember) {
      await memberService.createMember(member);
    }

    await handleGuildLogging(member);
    await handleGuildNotification(member);
  },
});

const handleGuildLogging = async (member: GuildMember) => {
  const loggingService = member.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**User Joined**", [
    {
      name: "User",
      value: `${member.client.functions.getUserMentionString(member.user)}`,
    },
  ]);
  await loggingService.sendLoggingMessage(member.guild, embed);
};

const handleGuildNotification = async (member: GuildMember) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle(`${member.displayName} has joined the server.`)
    .setThumbnail(member.avatar);

  const notificationService = member.client.services.notificationService;
  await notificationService.sendNotificationMessage(member.guild, embed);
};
