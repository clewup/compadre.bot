import { Command } from "../../structures/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import NotificationService from "../../services/notificationService";

/**
 *    @name notifications
 *    @description Configure guild notification settings.
 *    The command requires a permission of ManageGuild.
 *    @param {boolean} enabled - Whether the notification system is enabled.
 *    @param {Channel} [channel] - The specified notification channel.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("notifications")
    .setDescription("Configure server notification settings.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether the notification system is enabled.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The specified notification channel.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  details: {
    category: "Config",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const notificationService = new NotificationService();

    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === false) {
      await handleDisable(interaction, notificationService);
    }
    if (enabled === true) {
      await handleEnable(interaction, notificationService);
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured notifications.",
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  notificationService: NotificationService
) => {
  // Looks for and deletes the default notification channel (#notifications).
  const defaultNotificationChannel =
    interaction.guild.channels.cache.find(
      (channel) =>
        channel.name === "notifications" &&
        channel.type === ChannelType.GuildText
    ) || null;
  if (defaultNotificationChannel) {
    await interaction.guild.channels.delete(
      defaultNotificationChannel,
      "Deleted as part of the notification configuration."
    );
  }

  // [Database]: Update the database.
  await notificationService.updateNotificationConfig(
    interaction.guild,
    null,
    false
  );
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  notificationService: NotificationService
) => {
  let notificationChannel = interaction.options.getChannel("channel");

  if (notificationChannel && !(notificationChannel instanceof TextChannel)) {
    return interaction.reply({
      content: "Invalid channel. You must provide a text channel.",
      ephemeral: true,
    });
  }

  // Create the notification channel with necessary permissions if one is not provided and does not already exist.
  if (!notificationChannel) {
    notificationChannel =
      interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === "notifications" &&
          channel.type === ChannelType.GuildText
      ) || null;

    if (!notificationChannel) {
      notificationChannel = await interaction.guild.channels.create({
        name: "notifications",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
        ],
      });
    }
  } else {
    // Overwrite the permissions for the provided notification channel.
    await notificationChannel.permissionOverwrites.set([
      {
        id: interaction.guild.roles.everyone.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
    ]);
  }

  if (!(notificationChannel instanceof TextChannel))
    return interaction.reply({
      content: "There was a problem creating the notification channel.",
      ephemeral: true,
    });

  // [Database]: Update the database.
  await notificationService.updateNotificationConfig(
    interaction.guild,
    notificationChannel.id,
    true
  );
};
