import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { Player, PlayerError, QueryType } from "discord-player";

/*
 *    Skips the current song in the channel.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song in the channel.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  details: {
    category: "Music",
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
