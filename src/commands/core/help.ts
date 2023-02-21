import { Command } from "../../base/command";
import {
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  EmbedField,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/*
 *    Shows a list of all available commands and their descriptions.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View available commands.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const fields: EmbedField[] = [];

    interaction.client.commands.forEach((command: Command, key: string) =>
      fields.push({
        name: `/${key}`,
        value: (command.data as SlashCommandBuilder).description,
        inline: false,
      })
    );

    const embed = new EmbedBuilder()
      .setTitle("Help")
      .setDescription("View available commands.")
      .setFields(fields);

    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  },
});
