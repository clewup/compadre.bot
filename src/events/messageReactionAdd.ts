import { Event } from "../structures/event";
import {
  EmbedBuilder,
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";

/**
 *    @name messageReactionAdd
 *    @description Emitted whenever a reaction is added to a message.
 */
export default new Event({
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (!reaction.message.guild) return;

    reaction.client.logger.logInfo(
      `${reaction.client.functions.getUserString(
        user
      )} has reacted to the message "${
        reaction.message.content
      }" in ${reaction.client.functions.getGuildString(
        reaction.message.guild
      )}.`
    );

    await handleGuildLogging(reaction, user);
    await handleWelcome(reaction, user);
  },
});

const handleGuildLogging = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  const loggingService = reaction.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed(
    "**Message Reaction**",
    [
      {
        name: "User",
        value: `${reaction.client.functions.getUserMentionString(user)}`,
      },
      {
        name: "Emoji",
        value: `${reaction.emoji}`,
      },
      {
        name: "Message",
        value: `${
          reaction.message.content ||
          reaction.message.embeds[0]?.title ||
          "Unknown"
        }`,
      },
    ]
  );
  await loggingService.sendLoggingMessage(reaction.message.guild, embed);
};

const handleWelcome = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  const welcomeService = reaction.client.services.welcomeService;
  const welcomeConfig = await welcomeService.getWelcomeConfig(
    reaction.message.guild
  );
  if (
    welcomeConfig &&
    welcomeConfig.role &&
    welcomeConfig.channel === reaction.message.channel.id &&
    welcomeConfig.enabled === true
  ) {
    const role = await reaction.message.guild!.roles.fetch(welcomeConfig.role);
    const guildUser = await reaction.message.guild!.members.fetch(user.id);

    if (role && guildUser) {
      await guildUser.roles.add(role);
    }
  }
};
