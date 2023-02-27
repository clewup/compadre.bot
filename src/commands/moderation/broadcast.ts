import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import NotificationConfigService from "../../services/notificationConfigService";

/*
 *    Broadcasts a message to the entire server.
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
    category: "Moderation",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const notificationConfigService = new NotificationConfigService();

    const message = interaction.options.getString("message");

    if (!message) {
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a message to be broadcasted.",
      });
    }

    const notificationChannel =
      await notificationConfigService.getNotificationChannel(interaction.guild);
    if (!notificationChannel) {
      return await interaction.reply({
        ephemeral: true,
        content: "A notification channel has not been setup.",
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
