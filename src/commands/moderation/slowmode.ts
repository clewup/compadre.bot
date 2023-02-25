import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

/*
 *    Enables slowmode in the channel.
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
    category: "Moderation",
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
