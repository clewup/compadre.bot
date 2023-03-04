import { Command } from "../../structures/command";
import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Categories } from "../../data/enums/categories";

/**
 *    @name prevent
 *    @description Configures guild message prevention/blocker settings.
 *    The command requires a permission of ManageGuild.
 *    @param {boolean} enabled - Whether the prevention system is enabled.
 *    @param {boolean} [links=false] - Whether links are prevented.
 *    @param {Role} [role=false] - The highest role that the prevention system takes effect.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("prevent")
    .setDescription("Configure server message prevention/blocker settings.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether the prevention system is enabled.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("links")
        .setDescription("Whether links are prevented.")
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(
          "The highest role that the prevention system takes effect."
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  details: {
    category: Categories.CONFIG,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const preventService = interaction.client.services.preventService;

    const enabled = interaction.options.getBoolean("enabled");
    const links = interaction.options.getBoolean("links");
    const role = interaction.options.getRole("role");

    const preventConfig = await preventService.getPreventConfig(
      interaction.guild
    );

    if (!preventConfig) {
      enabled === true
        ? await preventService.createPreventConfig(
            interaction.guild,
            role ? role.id : null,
            !!links,
            true
          )
        : await preventService.createPreventConfig(
            interaction.guild,
            null,
            false,
            false
          );
    } else {
      enabled === true
        ? await preventService.updatePreventConfig(
            interaction.guild,
            role ? role.id : null,
            !!links,
            true
          )
        : await preventService.updatePreventConfig(
            interaction.guild,
            null,
            false,
            false
          );
    }

    await interaction.reply({
      ephemeral: true,
      content: "Successfully configured message prevention.",
    });
  },
});
