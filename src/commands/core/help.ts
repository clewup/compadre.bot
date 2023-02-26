import { Command } from "../../structures/command";
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

  details: {
    category: "Core",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const data: string[] = [];

    interaction.client.commands.forEach((command: Command, key: string) => {
      const category = `\n**${command.details.category}**`;

      if (!data.includes(category)) {
        data.push(category);
      }
      data.push(`/${key} - ${command.data.description}`);
    });

    const embed = new EmbedBuilder()
      .setTitle("Help")
      .setDescription(`View available commands. \n${data.join("\n")}`);

    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  },
});
