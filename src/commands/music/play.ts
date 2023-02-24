import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { Player, PlayerError, QueryType } from "discord-player";

/*
 *    Plays a song in the channel.
 *    <params="song (string)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song in the channel.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The chosen song.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const song = interaction.options.getString("song");

    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });
    if (
      interaction.guild.members.me?.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      });

    if (!song)
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a song.",
      });

    const player: Player = interaction.client.player;

    player.on("error", (queue, message) => {
      interaction.client.logger.logError(message);
    });
    player.on("connectionError", (queue, message) => {
      interaction.client.logger.logError(message);
    });

    const queue = await player.createQueue(interaction.guild, {
      ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      metadata: interaction.channel,
      autoSelfDeaf: false,
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel!);
    } catch {
      void player.deleteQueue(interaction.guild);
      return await interaction.reply({
        content: "Could not join your voice channel!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const track = await player
      .search(song, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `${track} not found.`,
      });

    queue.play(track);

    return await interaction.followUp({
      content: `Now playing ${track.title}.`,
    });
  },
});
