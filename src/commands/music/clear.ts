import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { Player, PlayerError, QueryType } from "discord-player";

/*
 *    Pauses a song in the channel.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the song queue in the current channel.")
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

    const queue = interaction.client.player.getQueue(interaction.guild);
    if (!queue || !queue.playing)
      return await interaction.reply({
        content: "No music is being played!",
      });

    queue.clear();

    return await interaction.reply({
      content: "Cleared the song queue.",
    });
  },
});
