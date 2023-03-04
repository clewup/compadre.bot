import { Event } from "../structures/event";
import {
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
} from "discord.js";

/**
 *    @name guildMemberUpdate
 *    @description Emitted whenever a user is updated (eg. new nickname/role change).
 */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    newMember.client.logger.logInfo(
      `${newMember.client.functions.getUserString(
        newMember.user
      )} has been updated in ${newMember.client.functions.getGuildString(
        newMember.guild
      )}.`
    );

    const memberService = newMember.client.services.memberService;
    await memberService.updateMember(newMember);

    await handleGuildLogging(oldMember, newMember);
  },
});

const handleGuildLogging = async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) => {
  const loggingService = newMember.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed("**User Updated**", [
    {
      name: "User",
      value: `${newMember.client.functions.getUserString(newMember.user)}`,
    },
  ]);
  await loggingService.sendLoggingMessage(newMember.guild, embed);
};
