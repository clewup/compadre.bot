import { Command } from "../base/command";
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
    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`Hello, ${interaction.user.username}`);

    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  },
});
