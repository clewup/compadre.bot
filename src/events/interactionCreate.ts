import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  Events,
  inlineCode,
  Interaction,
} from "discord.js";

import { Event } from "../structures/event";
import { loggingService } from "../services";
import { functions, logger } from "../helpers";

/**
 *    @name interactionCreate
 *    @description Emitted whenever an interaction is created (eg. slash command).
 *    Executes a matching command.
 */
export default new Event({
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.inCachedGuild()) return;

    logger.info(
      `${functions.getUserString(
        interaction.user
      )} has issued the interaction "${
        interaction.commandName
      }" in ${functions.getGuildString(interaction.guild)}.`
    );

    await handleGuildLogging(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command?.data) {
      interaction.reply({
        content: `⚠️ There is no command matching ${inlineCode(
          interaction.commandName
        )}!`,
        ephemeral: true,
      });
      logger.warning(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: `There was an error while executing this command. \nCheck the console for more info.`,
        ephemeral: true,
      });
      logger.warning(`Error executing ${interaction.commandName}: ${error}`);
    }
  },
});

const handleGuildLogging = async (interaction: Interaction<CacheType>) => {
  const parameters: unknown[] = [];
  (interaction as CommandInteraction).options.data.forEach((param) =>
    parameters.push(param.value)
  );

  const embed = await loggingService.createEmbed("**Command Executed**", [
    {
      name: "User",
      value: `${functions.getUserMentionString(interaction.user)}`,
      inline: false,
    },
    {
      name: "Command",
      value: `${(interaction as CommandInteraction).commandName}`,
      inline: false,
    },
    {
      name: "Parameters",
      value: `${parameters.length ? parameters.join("\n") : "None"}`,
      inline: false,
    },
    {
      name: "Channel",
      value: `${interaction.channel}`,
      inline: false,
    },
  ]);
  await loggingService.send(interaction.guild!, embed);
};
