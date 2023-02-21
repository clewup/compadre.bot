import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import GuildService from "../../services/guildService";

/*
 *    Updates the default notification channel.
 *    In most cases the default is the "General" channel.
 *    <params="channel (channel)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("set-notification-channel")
    .setDescription("Set the channel for all botty notifications.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The chosen notification channel.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const guildService = new GuildService();

    const notificationChannel = interaction.options.getChannel("channel");

    await guildService.updateNotificationChannel(
      interaction.guild,
      notificationChannel?.id!
    );

    await interaction.reply({
      ephemeral: true,
      content: "Notification channel successfully updated.",
    });
  },
});
