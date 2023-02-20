import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specified amount of messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to be cleared.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const amount = interaction.options.getInteger("amount");
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${amount} messages cleared.`);

    interaction.channel?.bulkDelete(amount!, true);
    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  },
});
