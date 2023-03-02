import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Permissions} from "../../data/enums/permissions";
import {Categories} from "../../data/enums/categories";

/**
 *    @name skip
 *    @description Skips the current song being played.
 *    The command requires a permission of Administrator.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song.")
    .setDefaultMemberPermissions(Permissions.MUSIC),

  details: {
    category: Categories.MUSIC,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
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
    if (!queue || !queue.playing)
      return await interaction.reply({
        content: "No music is being played!",
      });

    queue.skip();

    const nowPlayingIndex = queue.tracks.indexOf(queue.current) + 1;

    return await interaction.reply({
      content: `Now playing ${queue.tracks[nowPlayingIndex].title}.`,
    });
  },
});
