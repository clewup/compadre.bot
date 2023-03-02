import { Command } from "../../structures/command";
import {
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Categories} from "../../data/enums/categories";

/**
 *    @name help
 *    @description Returns a list of all compadre commands (even those the user does not have permission to use).
 *    The command requires a permission of SendMessages.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View all compadre commands.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.UTILITIES,
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
