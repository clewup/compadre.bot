import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  Events,
  inlineCode,
  Interaction,
} from "discord.js";

import { Event } from "../structures/event";

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

    interaction.client.logger.logInfo(
      `${interaction.client.functions.getUserString(
        interaction.user
      )} has issued the interaction "${
        interaction.commandName
      }" in ${interaction.client.functions.getGuildString(interaction.guild)}.`
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
      interaction.client.logger.logWarning(
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
      interaction.client.logger.logWarning(
        `Error executing ${interaction.commandName}: ${error}`
      );
    }
  },
});

const handleGuildLogging = async (interaction: Interaction<CacheType>) => {
  const loggingService = interaction.client.services.loggingService;
  const embed = await loggingService.createLoggingEmbed(
    "**Command Executed**",
    [
      {
        name: "User",
        value: `${interaction.client.functions.getUserString(
          interaction.user
        )}`,
      },
      {
        name: "Command",
        value: `${(interaction as CommandInteraction).commandName}`,
      },
    ]
  );
  await loggingService.sendLoggingMessage(interaction.guild, embed);
};
