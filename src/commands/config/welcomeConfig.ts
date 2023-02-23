import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  ChannelType,
} from "discord.js";
import WelcomeConfigService from "../../services/welcomeConfigService";

/*
 *    Configures the welcome.
 *    <params="channel? (text channel), role? (role), message? (string), enabled (boolean)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("welcome-config")
    .setDescription("Configure the botty welcome.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether the welcome is enabled.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Optional: The selected welcome channel.")
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Optional: The role given to verified users.")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Optional: The welcome message.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const welcomeConfigService = new WelcomeConfigService();

    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === false) {
      await handleDisable(interaction, welcomeConfigService);
    }
    if (enabled === true) {
      await handleEnable(interaction, welcomeConfigService);
    }

    await interaction.reply({
      content: "Successfully configured the botty welcome.",
      ephemeral: true,
    });
  },
});

const handleDisable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  welcomeConfigService: WelcomeConfigService
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
      "Deleted as part of the welcome configuration from botty."
    );
  }

  // [Database]: Update the database.
  await welcomeConfigService.updateWelcomeConfig(
    interaction.guild,
    null,
    null,
    null,
    false
  );
};

const handleEnable = async (
  interaction: ChatInputCommandInteraction<"cached">,
  welcomeConfigService: WelcomeConfigService
) => {
  let welcomeChannel = interaction.options.getChannel("channel");
  let welcomeRole = interaction.options.getRole("role");
  const welcomeMessage = interaction.options.getString("message");

  if (welcomeChannel && !(welcomeChannel instanceof TextChannel))
    return interaction.reply({
      content: "Invalid channel. You must provide a text channel.",
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
      content: "There was a problem creating the welcome channel.",
      ephemeral: true,
    });

  await welcomeChannel.bulkDelete(100);

  // Create the conformist role with basic permissions if one is not provided and does not already exist.
  if (!welcomeRole) {
    welcomeRole =
      interaction.guild.roles.cache.find(
        (role) => role.name === "conformist"
      ) || null;

    if (!welcomeRole) {
      welcomeRole = await interaction.guild.roles.create({
        name: "conformist",
        color: Colors.Orange,
        reason: "Created by botty.",
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

  // [Database]: Update the database.
  await welcomeConfigService.updateWelcomeConfig(
    interaction.guild,
    welcomeChannel.id,
    welcomeRole.id,
    welcomeMessage,
    true
  );

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
