import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Permissions} from "../../data/enums/permissions";
import {Categories} from "../../data/enums/categories";

/**
 *    @name bassboost
 *    @description Enables/disables bassboost in the channel that the command is executed.
 *    The command requires a permission of Administrator.
 *    @param {boolean} enabled - Whether bassboost is enabled in the channel.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("Любишь пить квас и слушать хардбасс?")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether bassboost is enabled on the queue.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(Permissions.MUSIC),

  details: {
    category: Categories.MUSIC,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const enabled = interaction.options.getBoolean("enabled");

    if (
      interaction.guild.members.me?.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      });

    const queue = interaction.client.player.getQueue(interaction.guild.id);

    if (enabled === true) {
      await queue.setFilters({
        bassboost: true,
        normalizer2: true,
      });
    }
    if (enabled === false) {
      await queue.setFilters({
        bassboost: false,
        normalizer2: false,
      });
    }

    return await interaction.reply({
      content: "Enabled bassboost.",
    });
  },
});
