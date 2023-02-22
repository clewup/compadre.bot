import { Collection, Events, bold, inlineCode } from "discord.js";

import { Event } from "../base/event";

/*
 *    Emitted whenever an interaction is created (eg. slash command).
 *    Executes a matching command.
 */
export default new Event({
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.inCachedGuild()) return;

    // [Logging]
    interaction.client.logger.logInfo(
      `${interaction.client.functions.getUserString(
        interaction.user
      )} has issued the interaction "${
        interaction.commandName
      }" in ${interaction.client.functions.getGuildString(interaction.guild)}.`
    );

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
