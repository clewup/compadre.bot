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

    let notificationChannel = interaction.options.getChannel("channel");
    const enabled = interaction.options.getBoolean("enabled");

    if (notificationChannel && !(notificationChannel instanceof TextChannel))
      return interaction.reply({
        content: "Invalid channel. You must provide a text channel.",
        ephemeral: true,
      });

    if (enabled === false) {
      await notificationConfigService.updateNotificationConfig(
        interaction.guild,
        null,
        false
      );
    }

    if (enabled === true) {
      // Create the notification channel with necessary permissions if one is not provided.
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
        enabled ?? true
      );
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured the botty notifications.",
    });
  },
});
