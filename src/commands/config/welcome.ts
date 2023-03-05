import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  ChannelType,
} from "discord.js";
import { welcomeService } from "../../services";
import { ErrorReasons, CrudReasons } from "../../enums/reasons";
import { Categories } from "../../enums/categories";

/**
 *    @name welcome
 *    @description Configures guild welcome message settings.
 *    The command requires a permission of ManageGuild.
 *    @param {boolean} enabled - Whether the welcome message is enabled.
 *    @param {Channel} [channel=general] - The specified welcome channel.
 *    @param {Role} [role=false] - The specified role for verified/welcomed users.
 *    @param {string} [message=Welcome to the Server!] - The specified welcome message.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Configure server welcome message settings.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether the welcome message is enabled.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The specified welcome channel.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The specified role for verified/welcomed users.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The specified welcome message.")
        .setRequired(false)
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
      content: "Successfully configured welcome.",
      ephemeral: true,
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">
) => {
  // Looks for and deletes the default welcome channel (#welcome).
  const defaultChannel =
    interaction.guild.channels.cache.find(
      (channel) =>
        channel.name === "welcome" && channel.type === ChannelType.GuildText
    ) || null;
  if (defaultChannel) {
    await interaction.guild.channels.delete(
      defaultChannel,
      CrudReasons.REMOVED
    );
  }

  const config = await welcomeService.get(interaction.guild);

  if (!config) {
    await welcomeService.create(interaction.guild, null, null, null, false);
  } else {
    await welcomeService.update(interaction.guild, null, null, null, false);
  }
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">
) => {
  let channel = interaction.options.getChannel("channel");
  let role = interaction.options.getRole("role");
  const message = interaction.options.getString("message");

  if (channel && !(channel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.INVALID_TEXT_CHANNEL,
      ephemeral: true,
    });

  // Create the welcome channel with necessary permissions if one is not provided and does not already exist.
  if (!channel) {
    channel =
      interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === "welcome" && channel.type === ChannelType.GuildText
      ) || null;

    if (!channel) {
      channel = await interaction.guild.channels.create({
        name: "welcome",
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.AddReactions,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
        ],
      });
    }
  } else {
    // Overwrite the permissions for the provided welcome channel.
    await channel.permissionOverwrites.set([
      {
        id: interaction.guild.roles.everyone.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.AddReactions,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
    ]);
  }

  if (!(channel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.CHANNEL_PROBLEM("welcome"),
      ephemeral: true,
    });

  await channel.bulkDelete(100);

  // Create the verified role with basic permissions if one is not provided and does not already exist.
  if (!role) {
    role =
      interaction.guild.roles.cache.find((role) => role.name === "verified") ||
      null;

    if (!role) {
      role = await interaction.guild.roles.create({
        name: "verified",
        color: Colors.Green,
        reason: CrudReasons.ADDED,
        permissions: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.SendMessagesInThreads,
          PermissionsBitField.Flags.AddReactions,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.UseApplicationCommands,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.Speak,
          PermissionsBitField.Flags.UseVAD,
        ],
      });
    }
  }

  const config = await welcomeService.get(interaction.guild);

  if (!config) {
    await welcomeService.create(
      interaction.guild,
      channel.id,
      role.id,
      message,
      true
    );
  } else {
    await welcomeService.update(
      interaction.guild,
      channel.id,
      role.id,
      message,
      true
    );
  }

  // Update the default permissions for new users (@everyone).
  await interaction.guild.roles.everyone.setPermissions([
    PermissionsBitField.Flags.AddReactions,
  ]);

  const embed = new EmbedBuilder()
    .setTitle(message ?? "Welcome to the Server!")
    .setDescription("To get started react to this message!");

  await channel.send({
    embeds: [embed],
  });
};
