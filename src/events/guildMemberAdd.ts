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
import { functions, logger } from "../helpers";

/**
 *    @name guildMemberAdd
 *    @description Emitted whenever a user joins a guild.
 */
export default new Event({
  name: Events.GuildMemberAdd,
  async execute(member) {
    logger.info(
      `${functions.getUserString(
        member.user
      )} has joined ${functions.getGuildString(member.guild)}.`
    );

    const existingMember = await memberService.get(member);
    if (!existingMember) {
      await memberService.create(member);
    }

    await handleGuildLogging(member);
    await handleGuildNotification(member);
  },
});

const handleGuildLogging = async (member: GuildMember) => {
  const embed = await loggingService.createEmbed("**User Joined**", [
    {
      name: "User",
      value: `${functions.getUserMentionString(member.user)}`,
      inline: false,
    },
  ]);
  await loggingService.send(member.guild, embed);
};

const handleGuildNotification = async (member: GuildMember) => {
  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle(`${member.displayName} has joined the server.`)
    .setThumbnail(member.avatar);

  await notificationService.send(member.guild, embed);
};
