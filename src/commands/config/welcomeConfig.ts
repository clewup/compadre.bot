import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import GuildService from "../../services/guildService";
import WelcomeConfigService from "../../services/welcomeConfigService";

/*
 *    Sets the welcome channel.
 *    <params="channel (channel)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("welcome-config")
    .setDescription("Configure the botty welcome.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The welcome channel.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The default role verified users.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The welcome message.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("instruction")
        .setDescription("The instructional message.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether the welcome is enabled.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const welcomeConfigService = new WelcomeConfigService();

    const welcomeChannel = interaction.options.getChannel(
      "channel"
    ) as TextChannel;
    const welcomeRole = interaction.options.getRole("role");
    const welcomeMessage = interaction.options.getString("message");
    const instructionMessage = interaction.options.getString("instruction");
    const enabled = interaction.options.getBoolean("enabled");

    // Update the database entry
    await welcomeConfigService.updateWelcomeConfig(
      interaction.guild,
      welcomeChannel?.id!,
      welcomeRole?.id!,
      welcomeMessage!,
      enabled ?? true
    );

    // Reply to the command
    await interaction.reply({
      content: "Successfully configured the botty welcome.",
      ephemeral: true,
    });

    // Clear the channel's messages
    await welcomeChannel.bulkDelete(10);

    const embed = new EmbedBuilder()
      .setTitle(welcomeMessage)
      .setDescription(
        instructionMessage ?? "`To get started react to this message!`"
      );

    // Send the welcome message and react with the join emoji
    await welcomeChannel.send({
      embeds: [embed],
    });
  },
});
