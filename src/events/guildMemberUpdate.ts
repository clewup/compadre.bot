import { Event } from "../structures/event";
import {
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
} from "discord.js";
import MemberService from "../services/memberService";
import LoggingService from "../services/loggingService";

/**
 *    @name guildMemberUpdate
 *    @description Emitted whenever a user is updated (eg. new nickname/role change).
 */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    const memberService = new MemberService();

    // [Logging]
    newMember.client.logger.logInfo(
      `${newMember.client.functions.getUserString(
        newMember.user
      )} has been updated in ${newMember.client.functions.getGuildString(
        newMember.guild
      )}.`
    );

    // [GuildLogging]
    await handleGuildLogging(oldMember, newMember);

    // [Database]: Update the database.
    await memberService.updateMember(newMember);
  },
});

const handleGuildLogging = async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) => {
  // Create the embed
  const loggingEmbed = new EmbedBuilder()
    .setTitle("**User Updated**")
    .addFields([
      {
        name: "User",
        value: `${newMember.client.functions.getUserString(newMember.user)}`,
      },
    ])
    .setFooter({ text: `${new Date().toISOString()}` });

  // Send the logs
  const loggingService = new LoggingService();
  const loggingConfig = await loggingService.getLoggingConfig(newMember.guild);
  if (loggingConfig?.enabled === true) {
    const loggingChannel = await loggingService.getLoggingChannel(
      newMember.guild
    );
    await loggingChannel?.send({
      embeds: [loggingEmbed],
    });
  }
};
