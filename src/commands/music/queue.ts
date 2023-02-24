import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { Player, PlayerError, QueryType, Track } from "discord-player";

/*
 *    Fetches the song queue.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Pause a song in the channel.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

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
    if (!queue || !queue.tracks[0]) {
      return await interaction.reply({
        content: "No music is queued up!",
      });
    }

    const totalTracks = queue.tracks.length;
    const tracks: string[] = [];
    queue.tracks.forEach((track: Track, index: number) => {
      tracks.push(
        `${index + 1}. ${track.title} - ${track.author} (requested by ${
          track.requestedBy.username
        }).`
      );
    });

    const embed = new EmbedBuilder()
      .setTitle(
        `There ${
          totalTracks === 1
            ? `is ${totalTracks} song`
            : `are ${totalTracks} songs`
        } in the queue.`
      )
      .setDescription(`${tracks.join("\n")}`);

    return await interaction.reply({
      embeds: [embed],
    });
  },
});
