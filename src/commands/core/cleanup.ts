import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/*
 *    Clears messages from a channel.
 *    <params="amount (number)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("cleanup")
    .setDescription("Clear a specified amount of messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to be cleared.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const amount = interaction.options.getInteger("amount");

    interaction.channel?.bulkDelete(amount!, true);
    await interaction.reply({
      ephemeral: true,
      content: `${amount} messages cleared.`,
    });
  },
});
