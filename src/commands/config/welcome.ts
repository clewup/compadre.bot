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
import WelcomeService from "../../services/welcomeService";
import { ErrorReasons, CrudReasons } from "../../data/enums/reasons";
import { Categories } from "../../data/enums/categories";

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
    const welcomeService = interaction.client.services.welcomeService;

    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === false) {
      await handleDisable(interaction, welcomeService);
    }
    if (enabled === true) {
      await handleEnable(interaction, welcomeService);
    }

    await interaction.reply({
      content: "Successfully configured welcome.",
      ephemeral: true,
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  welcomeService: WelcomeService
) => {
  // Looks for and deletes the default welcome channel (#welcome).
  const defaultWelcomeChannel =
    interaction.guild.channels.cache.find(
      (channel) =>
        channel.name === "welcome" && channel.type === ChannelType.GuildText
    ) || null;
  if (defaultWelcomeChannel) {
    await interaction.guild.channels.delete(
      defaultWelcomeChannel,
      CrudReasons.REMOVED
    );
  }

  const welcomeConfig = await welcomeService.getWelcomeConfig(
    interaction.guild
  );

  if (!welcomeConfig) {
    await welcomeService.createWelcomeConfig(
      interaction.guild,
      null,
      null,
      null,
      false
    );
  } else {
    await welcomeService.updateWelcomeConfig(
      interaction.guild,
      null,
      null,
      null,
      false
    );
  }
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  welcomeService: WelcomeService
) => {
  let welcomeChannel = interaction.options.getChannel("channel");
  let welcomeRole = interaction.options.getRole("role");
  const welcomeMessage = interaction.options.getString("message");

  if (welcomeChannel && !(welcomeChannel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.INVALID_TEXT_CHANNEL,
      ephemeral: true,
    });

  // Create the welcome channel with necessary permissions if one is not provided and does not already exist.
  if (!welcomeChannel) {
    welcomeChannel =
      interaction.guild.channels.cache.find(
        (channel) =>
          channel.name === "welcome" && channel.type === ChannelType.GuildText
      ) || null;

    if (!welcomeChannel) {
      welcomeChannel = await interaction.guild.channels.create({
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
    await welcomeChannel.permissionOverwrites.set([
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

  if (!(welcomeChannel instanceof TextChannel))
    return interaction.reply({
      content: ErrorReasons.CHANNEL_PROBLEM("welcome"),
      ephemeral: true,
    });

  await welcomeChannel.bulkDelete(100);

  // Create the verified role with basic permissions if one is not provided and does not already exist.
  if (!welcomeRole) {
    welcomeRole =
      interaction.guild.roles.cache.find((role) => role.name === "verified") ||
      null;

    if (!welcomeRole) {
      welcomeRole = await interaction.guild.roles.create({
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

  const welcomeConfig = await welcomeService.getWelcomeConfig(
    interaction.guild
  );

  if (!welcomeConfig) {
    await welcomeService.createWelcomeConfig(
      interaction.guild,
      welcomeChannel.id,
      welcomeRole.id,
      welcomeMessage,
      true
    );
  } else {
    await welcomeService.updateWelcomeConfig(
      interaction.guild,
      welcomeChannel.id,
      welcomeRole.id,
      welcomeMessage,
      true
    );
  }

  // Update the default permissions for new users (@everyone).
  await interaction.guild.roles.everyone.setPermissions([
    PermissionsBitField.Flags.AddReactions,
  ]);

  const embed = new EmbedBuilder()
    .setTitle(welcomeMessage ?? "Welcome to the Server!")
    .setDescription("To get started react to this message!");

  await welcomeChannel.send({
    embeds: [embed],
  });
};
