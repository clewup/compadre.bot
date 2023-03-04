import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
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
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const message = interaction.options.getString("message");

    if (!message) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_PARAMETER("message"),
      });
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setTitle("Attention!")
      .setDescription(`${message} ${interaction.guild.roles.everyone}`);

    const notificationService =
      interaction.guild.client.services.notificationService;
    const notificationChannel =
      await notificationService.getNotificationChannel(interaction.guild);
    if (!notificationChannel) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_CHANNEL_NONEXISTENT("notification"),
      });
    }
    await notificationService.sendNotificationMessage(interaction.guild, embed);

    await interaction.reply({
      ephemeral: true,
      content: "Your message has been broadcast.",
    });
  },
});
