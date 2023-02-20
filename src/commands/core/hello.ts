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
    .setName("hello")
    .setDescription("Say hello!")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
      ephemeral: true,
      content: `Hello, ${interaction.user.username}`,
    });
  },
});
