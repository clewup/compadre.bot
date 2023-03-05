import { Command } from "../../structures/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { notificationService } from "../../services";
import { Categories } from "../../enums/categories";
import { ErrorReasons, CrudReasons } from "../../enums/reasons";

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
    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === false) {
      await handleDisable(interaction);
    }
    if (enabled === true) {
      await handleEnable(interaction);
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured notifications.",
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">
) => {
  // Looks for and deletes the default notification channel (#notifications).
  const defaultChannel =
    interaction.guild.channels.cache.find(
      (channel) =>
        channel.name === "notifications" &&
        channel.type === ChannelType.GuildText
    ) || null;
  if (defaultChannel) {
    await interaction.guild.channels.delete(
      defaultChannel,
      CrudReasons.REMOVED
    );
  }

  const config = await notificationService.get(interaction.guild.id);

  if (!config) {
    await notificationService.create(interaction.guild, null, false);
  } else {
    await notificationService.update(interaction.guild, null, false);
  }
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">
) => {
  let channel = interaction.options.getChannel("channel");

  if (channel && !(channel instanceof TextChannel)) {
    return interaction.reply({
      content: ErrorReasons.INVALID_TEXT_CHANNEL,
      ephemeral: true,
    });
  }

  // Create the notification channel with necessary permissions if one is not provided and does not already exist.
  if (!channel) {
    channel =
      interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === "notifications" &&
          channel.type === ChannelType.GuildText
      ) || null;

    if (!channel) {
      channel = await interaction.guild.channels.create({
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
    await channel.permissionOverwrites.set([
      {
        id: interaction.guild.roles.everyone.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
    ]);
  }

  if (!(channel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.CHANNEL_PROBLEM("notification"),
      ephemeral: true,
    });

  const config = await notificationService.get(interaction.guild.id);

  if (!config) {
    await notificationService.create(interaction.guild, channel.id, true);
  } else {
    await notificationService.update(interaction.guild, channel.id, true);
  }
};
