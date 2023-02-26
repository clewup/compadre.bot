import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { Player, PlayerError, QueryType } from "discord-player";

/*
 *    Enables/disables bassboost on the queue.
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
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  details: {
    category: "Music",
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
