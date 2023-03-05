import { Command } from "../../structures/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Categories } from "../../enums/categories";
import { loggingService } from "../../services";
import { ErrorReasons, CrudReasons } from "../../enums/reasons";

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
      content: "Successfully configured logging.",
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">
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

  const config = await loggingService.get(interaction.guild.id);

  if (!config) {
    await loggingService.create(interaction.guild, null, null, false);
  } else {
    await loggingService.update(interaction.guild, null, null, false);
  }
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">
) => {
  let channel = interaction.options.getChannel("channel");
  let role = interaction.options.getRole("role");

  if (channel && !(channel instanceof TextChannel)) {
    return interaction.reply({
      content: ErrorReasons.INVALID_TEXT_CHANNEL,
      ephemeral: true,
    });
  }
  if (!role) {
    return interaction.reply({
      content: ErrorReasons.INVALID_ROLE,
      ephemeral: true,
    });
  }

  // Create the logging channel with necessary permissions if one is not provided and does not already exist.
  if (!channel) {
    channel =
      interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === "logs" && channel.type === ChannelType.GuildText
      ) || null;

    if (!channel) {
      channel = await interaction.guild.channels.create({
        name: "logs",
        type: ChannelType.GuildText,

        permissionOverwrites: [
          {
            id: role.id,
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
    await channel.permissionOverwrites.set([
      {
        id: role.id,
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

  if (!(channel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.CHANNEL_PROBLEM("logs"),
      ephemeral: true,
    });

  const config = await loggingService.get(interaction.guild.id);

  if (!config) {
    await loggingService.create(interaction.guild, role.id, channel.id, true);
  } else {
    await loggingService.update(interaction.guild, role.id, channel.id, true);
  }
};
