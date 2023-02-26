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
import PreventConfigService from "../../services/preventConfigService";

/*
 *    Configures notifications.
 *    <params="channel? (text channel), enabled (boolean)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("prevent")
    .setDescription("Configure message blockers.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether message blockers are enabled.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("links")
        .setDescription(
          "Optional: Whether links are allowed (false by default)."
        )
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("spam")
        .setDescription("Optional: Whether spam is allowed (false by default).")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("ads")
        .setDescription("Optional: Whether ads are allowed (false by default).")
        .setRequired(false)
    )

    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(
          "Optional: The highest role that these blockers take effect (all by default)."
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  details: {
    category: "Config",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const preventConfigService = new PreventConfigService();

    const enabled = interaction.options.getBoolean("enabled");
    const links = interaction.options.getBoolean("links");
    const spam = interaction.options.getBoolean("spam");
    const ads = interaction.options.getBoolean("ads");
    const role = interaction.options.getRole("role");

    if (enabled === false) {
      // [Database]: Update the database.
      await preventConfigService.updatePreventConfig(
        interaction.guild,
        null,
        false,
        false,
        false,
        false
      );
    }
    if (enabled === true) {
      // [Database]: Update the database.
      await preventConfigService.updatePreventConfig(
        interaction.guild,
        role ? role.id : null,
        !!links,
        !!spam,
        !!ads,
        true
      );
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured message blockers.",
    });
  },
});
