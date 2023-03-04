import {
  AudioPlayerStatus,
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  StreamType,
  VoiceConnectionStatus,
  entersState,
  VoiceConnection,
} from "@discordjs/voice";
import { ChatInputCommandInteraction, VoiceBasedChannel } from "discord.js";

/**
 *    @class
 *    Creates a new instance of Soundboard.
 */
class Soundboard {
  constructor() {}

  public async playSoundEffect(
    interaction: ChatInputCommandInteraction<"cached">,
    url: string
  ) {
    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      });

    const player = createAudioPlayer();
    const channel = interaction.member.voice.channel;

    if (!channel)
      return await interaction.reply({
        content: "There was a problem fetching your channel!",
        ephemeral: true,
      });

    try {
      const connection = await this.connectToChannel(channel);

      if (!connection)
        return await interaction.reply({
          content: "There was a problem connecting to your channel!",
          ephemeral: true,
        });

      connection.subscribe(player);

      const resource = createAudioResource(url, {
        inputType: StreamType.Arbitrary,
      });
      player.play(resource);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });
    } catch (error) {
      interaction.client.logger.logError(error);
    }
  }

  public async connectToChannel(
    channel: VoiceBasedChannel
  ): Promise<VoiceConnection | undefined> {
    const connection = await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 5e3).catch(
        () => {}
      );
      return connection;
    } catch (error) {
      connection.destroy();
    }
  }
}
export default Soundboard;
