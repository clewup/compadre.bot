import { Command } from "../../base/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import GuildService from "../../services/guildService";
import NotificationConfigService from "../../services/notificationConfigService";

/*
 *    Configures notifications.
 *    <params="channel? (text channel), enabled (boolean)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("notification-config")
    .setDescription("Configure the botty notifications.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether notifications are enabled.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Optional: The selected notification channel.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const notificationConfigService = new NotificationConfigService();

    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === false) {
      await handleDisable(interaction, notificationConfigService);
    }
    if (enabled === true) {
      await handleEnable(interaction, notificationConfigService);
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured the botty notifications.",
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  notificationConfigService: NotificationConfigService
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
      "Deleted as part of the notification configuration from botty."
    );
  }

  // [Database]: Update the database.
  await notificationConfigService.updateNotificationConfig(
    interaction.guild,
    null,
    false
  );
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  notificationConfigService: NotificationConfigService
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
  await notificationConfigService.updateNotificationConfig(
    interaction.guild,
    notificationChannel.id,
    true
  );
};
