import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Categories} from "../../data/enums/categories";

/**
 *    @name slowmode
 *    @description Enables/disables slowmode (message rate limit) in the channel that the command is executed.
 *    The command requires a permission of ManageChannels.
 *    @param {boolean} enabled - Whether slowmode is enabled in the channel.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Enable/disable slowmode in the channel.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether slowmode is enabled.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  details: {
    category: Categories.MODERATION,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const enabled = interaction.options.getBoolean("enabled");

    if (enabled === true) {
      await interaction.channel?.setRateLimitPerUser(1);
    }
    if (enabled === false) {
      await interaction.channel?.setRateLimitPerUser(100);
    }

    await interaction.reply({
      ephemeral: true,
      content: `Slowmode has been enabled in ${interaction.channel?.name}.`,
    });
  },
});
