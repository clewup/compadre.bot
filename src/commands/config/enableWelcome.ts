import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import GuildService from "../../services/guildService";
import WelcomeConfigService from "../../services/welcomeConfigService";

/*
 *    Sets the welcome channel.
 *    <params="channel (channel)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("enable-welcome")
    .setDescription("Enable the welcome channel for new users.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The chosen welcome channel.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The default role for new users.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The welcome message.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const welcomeConfigService = new WelcomeConfigService();

    const welcomeChannel = interaction.options.getChannel("channel");
    const welcomeRole = interaction.options.getRole("role");
    const welcomeMessage = interaction.options.getString("message");

    await welcomeConfigService.updateWelcomeConfig(
      interaction.guild,
      welcomeChannel?.id!,
      welcomeRole?.id!,
      welcomeMessage!,
      true
    );

    await interaction.reply({
      ephemeral: true,
      content: "Welcome channel successfully updated.",
    });
  },
});
