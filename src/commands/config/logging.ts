import { Command } from "../../structures/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Categories } from "../../data/enums/categories";
import LoggingService from "../../services/loggingService";
import { ErrorReasons, CrudReasons } from "../../data/enums/reasons";

/**
 *    @name logging
 *    @description Configure guild logging settings.
 *    The command requires a permission of ManageGuild.
 *    @param {boolean} enabled - Whether the logging system is enabled.
 *    @param {Role} role - The lowest role that can view the logs.
 *    @param {Channel} [channel] - The specified logging channel.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("logging")
    .setDescription("Configure server logging settings.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether the logging system is enabled.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The lowest role that can view the logs.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The specified logging channel.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  details: {
    category: Categories.CONFIG,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const loggingService = interaction.client.services.loggingService;

    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === false) {
      await handleDisable(interaction, loggingService);
    }
    if (enabled === true) {
      await handleEnable(interaction, loggingService);
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured logging.",
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  loggingService: LoggingService
) => {
  // Looks for and deletes the default logging channel (#logs).
  const defaultLoggingChannel =
    interaction.guild.channels.cache.find(
      (channel) =>
        channel.name === "logs" && channel.type === ChannelType.GuildText
    ) || null;
  if (defaultLoggingChannel) {
    await interaction.guild.channels.delete(
      defaultLoggingChannel,
      CrudReasons.REMOVED
    );
  }

  const loggingConfig = await loggingService.getLoggingConfig(
    interaction.guild
  );

  if (!loggingConfig) {
    await loggingService.createLoggingConfig(
      interaction.guild,
      null,
      null,
      false
    );
  } else {
    await loggingService.updateLoggingConfig(
      interaction.guild,
      null,
      null,
      false
    );
  }
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  loggingService: LoggingService
) => {
  let loggingChannel = interaction.options.getChannel("channel");
  let minimumRole = interaction.options.getRole("role");

  if (loggingChannel && !(loggingChannel instanceof TextChannel)) {
    return interaction.reply({
      content: ErrorReasons.INVALID_TEXT_CHANNEL,
      ephemeral: true,
    });
  }
  if (!minimumRole) {
    return interaction.reply({
      content: ErrorReasons.INVALID_ROLE,
      ephemeral: true,
    });
  }

  // Create the logging channel with necessary permissions if one is not provided and does not already exist.
  if (!loggingChannel) {
    loggingChannel =
      interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === "logs" && channel.type === ChannelType.GuildText
      ) || null;

    if (!loggingChannel) {
      loggingChannel = await interaction.guild.channels.create({
        name: "logs",
        type: ChannelType.GuildText,

        permissionOverwrites: [
          {
            id: minimumRole.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: interaction.guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
    }
  } else {
    // Overwrite the permissions for the provided logging channel.
    await loggingChannel.permissionOverwrites.set([
      {
        id: minimumRole.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
    ]);
  }

  if (!(loggingChannel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.CHANNEL_PROBLEM("logs"),
      ephemeral: true,
    });

  const loggingConfig = await loggingService.getLoggingConfig(
    interaction.guild
  );

  if (!loggingConfig) {
    await loggingService.createLoggingConfig(
      interaction.guild,
      minimumRole.id,
      loggingChannel.id,
      true
    );
  } else {
    await loggingService.updateLoggingConfig(
      interaction.guild,
      minimumRole.id,
      loggingChannel.id,
      true
    );
  }
};
