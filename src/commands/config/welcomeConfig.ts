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

    let welcomeChannel = interaction.options.getChannel("channel");
    let welcomeRole = interaction.options.getRole("role");
    const welcomeMessage = interaction.options.getString("message");
    const enabled = interaction.options.getBoolean("enabled");

    if (welcomeChannel && !(welcomeChannel instanceof TextChannel))
      return interaction.reply({
        content: "Invalid channel. You must provide a text channel.",
        ephemeral: true,
      });

    if (enabled === false) {
      await welcomeConfigService.updateWelcomeConfig(
        interaction.guild,
        null,
        null,
        null,
        false
      );
    }

    if (enabled === true) {
      // Create the welcome channel with necessary permissions if one is not provided.
      if (!welcomeChannel) {
        // Check if a welcome channel has already been created.
        welcomeChannel =
          interaction.guild.channels.cache.find(
            (channel) =>
              channel.name === "welcome" &&
              channel.type === ChannelType.GuildText
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

      // Create the verified role with basic permissions if one is not provided.
      if (!welcomeRole) {
        // Check if a verified role has already been created.
        welcomeRole =
          interaction.guild.roles.cache.find(
            (role) => role.name === "Conformist"
          ) || null;

        if (!welcomeRole) {
          welcomeRole = await interaction.guild.roles.create({
            name: "Conformist",
            color: Colors.Red,
            reason: "Created as part of the welcome configuration from botty.",
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
        enabled
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

      await interaction.reply({
        content: "Successfully configured the botty welcome.",
        ephemeral: true,
      });
    }
  },
});
