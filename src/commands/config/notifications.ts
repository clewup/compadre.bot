import { Command } from "../../structures/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import NotificationService from "../../services/notificationService";
import { Categories } from "../../data/enums/categories";
import { ErrorReasons, CrudReasons } from "../../data/enums/reasons";

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
    category: Categories.CONFIG,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const notificationService = interaction.client.services.notificationService;

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
      CrudReasons.REMOVED
    );
  }

  const notificationConfig = await notificationService.getNotificationConfig(
    interaction.guild
  );

  if (!notificationConfig) {
    await notificationService.createNotificationConfig(
      interaction.guild,
      null,
      false
    );
  } else {
    await notificationService.updateNotificationConfig(
      interaction.guild,
      null,
      false
    );
  }
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  notificationService: NotificationService
) => {
  let notificationChannel = interaction.options.getChannel("channel");

  if (notificationChannel && !(notificationChannel instanceof TextChannel)) {
    return interaction.reply({
      content: ErrorReasons.INVALID_TEXT_CHANNEL,
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
      content: ErrorReasons.CHANNEL_PROBLEM("notification"),
      ephemeral: true,
    });

  const notificationConfig = await notificationService.getNotificationConfig(
    interaction.guild
  );

  if (!notificationConfig) {
    await notificationService.createNotificationConfig(
      interaction.guild,
      notificationChannel.id,
      true
    );
  } else {
    await notificationService.updateNotificationConfig(
      interaction.guild,
      notificationChannel.id,
      true
    );
  }
};
