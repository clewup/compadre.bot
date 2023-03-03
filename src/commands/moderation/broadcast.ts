import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import NotificationService from "../../services/notificationService";
import { Categories } from "../../data/enums/categories";
import { ErrorReasons } from "../../data/enums/reasons";

/**
 *    @name broadcast
 *    @description Broadcasts a message to the entire guild.
 *    @param message string
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("Broadcast a message to the entire server.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The broadcast message.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  details: {
    category: Categories.MODERATION,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const notificationService = new NotificationService();

    const message = interaction.options.getString("message");

    if (!message) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_PARAMETER("message"),
      });
    }

    const notificationChannel =
      await notificationService.getNotificationChannel(interaction.guild);
    if (!notificationChannel) {
      return await interaction.reply({
        ephemeral: true,
        content:
          ErrorReasons.INVALID_CHANNEL_NONEXISTENT("notification"),
      });
    }

    await notificationChannel.send(
      `${message} ${interaction.guild.roles.everyone}`
    );

    await interaction.reply({
      ephemeral: true,
      content: "Your message has been broadcast.",
    });
  },
});
