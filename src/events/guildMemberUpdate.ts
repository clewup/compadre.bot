import { Event } from "../structures/event";
import {
  EmbedBuilder,
  Events,
  GuildMember,
  PartialGuildMember,
} from "discord.js";
import { loggingService, memberService } from "../services";
import { logger } from "../helpers";

/**
 *    @name guildMemberUpdate
 *    @description Emitted whenever a user is updated (e.g. new nickname/role change).
 */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    logger.info(
      `${newMember.client.functions.getUserString(
        newMember.user
      )} has been updated in ${newMember.client.functions.getGuildString(
        newMember.guild
      )}.`
    );

    await memberService.update(newMember);

    await handleGuildLogging(oldMember, newMember);
  },
});

const handleGuildLogging = async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) => {
  const embed = loggingService.createEmbed("**User Updated**", [
    {
      name: "User",
      value: `${newMember.client.functions.getUserMentionString(
        newMember.user
      )}`,
      inline: false,
    },
  ]);
  await loggingService.send(newMember.guild, embed);
};
