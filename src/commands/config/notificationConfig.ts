import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import GuildService from "../../services/guildService";
import NotificationConfigService from "../../services/notificationConfigService";

/*
 *    Updates the default notification channel.
 *    In most cases the default is the "General" channel.
 *    <params="channel (channel)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("notification-config")
    .setDescription("Configure the botty notifications.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The notification channel.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether notifications are enabled.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const notificationConfigService = new NotificationConfigService();

    const notificationChannel = interaction.options.getChannel("channel");
    const enabled = interaction.options.getBoolean("enabled");

    await notificationConfigService.updateNotificationConfig(
      interaction.guild,
      notificationChannel?.id!,
      enabled ?? true
    );

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured the botty notifications.",
    });
  },
});
