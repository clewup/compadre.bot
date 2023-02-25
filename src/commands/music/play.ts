import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {
  Player,
  PlayerSearchResult,
  QueryType,
  Queue,
  QueueRepeatMode,
  Track,
} from "discord-player";

/*
 *    Plays a song in the channel.
 *    <params="song (string)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or playlist in the channel.")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("The chosen song or playlist.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

  details: {
    category: "Music",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply();

    const search = interaction.options.getString("search");

    // Handle any errors
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
    if (!search)
      return await interaction.reply({
        ephemeral: true,
        content: "Please provide a song or playlist.",
      });

    // Find/create the queue.
    let queue = await interaction.client.player.getQueue(interaction.guild.id);
    if (!queue) {
      queue = await createQueue(interaction);
    }

    // Connect to the voice channel.
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel!);
    } catch {
      void interaction.client.player.deleteQueue(interaction.guild.id);
      return await interaction.reply({
        content: "Could not join your voice channel!",
        ephemeral: true,
      });
    }

    // Lookup the track/playlist.
    const track = await interaction.client.player
      .search(search, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .then((result: PlayerSearchResult) => result.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `${search} not found.`,
      });

    // Play the track/playlist.
    if (track.playlist) {
      await handlePlaylist(queue, track, interaction);
    } else {
      await handleTrack(queue, track, interaction);
    }
  },
});

const createQueue = async (
  interaction: ChatInputCommandInteraction<"cached">
): Promise<Queue> => {
  const queue: Queue = await interaction.client.player.createQueue(
    interaction.guild.id,
    {
      ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      metadata: interaction.channel,
    }
  );
  queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);

  return queue;
};

const handlePlaylist = async (
  queue: Queue,
  track: Track,
  interaction: ChatInputCommandInteraction<"cached">
) => {
  queue.addTracks(track.playlist!.tracks);

  if (!queue.playing) {
    await queue.play();

    return await interaction.followUp({
      content: `Now playing ${track.title}.`,
    });
  }
};

const handleTrack = async (
  queue: Queue,
  track: Track,
  interaction: ChatInputCommandInteraction<"cached">
) => {
  if (!queue.playing) {
    await queue.play(track);

    return await interaction.followUp({
      content: `Now playing ${track.title}.`,
    });
  }

  queue.addTrack(track);

  return await interaction.followUp({
    content: `${track.title} has been added to the queue.`,
  });
};
