import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Categories } from "../../enums/categories";
import { ErrorReasons } from "../../enums/reasons";

/**
 *    @name clear
 *    @description Deletes a specified amount of messages from the channel that the command is executed.
 *    The command requires a permission of ManageMessages.
 *    @param {number} amount - The amount of messages to be deleted.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes a specified amount of messages from the channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to be deleted.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  details: {
    category: Categories.CORE,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const amount = interaction.options.getInteger("amount");

    if (
      !interaction.channel ||
      (interaction.channel && !(interaction.channel instanceof TextChannel))
    ) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_TEXT_CHANNEL,
      });
    }

    await interaction.channel.bulkDelete(amount!, true);
    await interaction.reply({
      ephemeral: true,
      content: `${amount} messages cleared.`,
    });
  },
});
