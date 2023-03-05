import { Event } from "../structures/event";
import {
  EmbedBuilder,
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { loggingService, welcomeService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name messageReactionAdd
 *    @description Emitted whenever a reaction is added to a message.
 */
export default new Event({
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (!reaction.message.guild) return;

    logger.info(
      `${functions.getUserString(user)} has reacted to the message "${
        reaction.message.content
      }" in ${functions.getGuildString(reaction.message.guild)}.`
    );

    await handleGuildLogging(reaction, user);
    await handleWelcome(reaction, user);
  },
});

const handleGuildLogging = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  const embed = await loggingService.createEmbed("**Message Reaction**", [
    {
      name: "User",
      value: `${functions.getUserMentionString(user)}`,
      inline: false,
    },
    {
      name: "Emoji",
      value: `${reaction.emoji}`,
      inline: false,
    },
    {
      name: "Message",
      value: `${
        reaction.message.content ||
        reaction.message.embeds[0]?.title ||
        "Unknown"
      }`,
      inline: false,
    },
  ]);
  await loggingService.send(reaction.message.guild!, embed);
};

const handleWelcome = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  const config = await welcomeService.get(reaction.message.guild!);
  if (
    config &&
    config.role &&
    config.channel === reaction.message.channel.id &&
    config.enabled === true
  ) {
    const role = await reaction.message.guild!.roles.fetch(config.role);
    const guildUser = await reaction.message.guild!.members.fetch(user.id);

    if (role && guildUser) {
      await guildUser.roles.add(role);
    }
  }
};
