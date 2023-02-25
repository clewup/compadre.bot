import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  VoiceChannel,
} from "discord.js";
import { Player, PlayerError, QueryType } from "discord-player";

/*
 *    Stops and deletes the queue.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing a song or playlist in the channel.")
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

    queue.destroy();

    return await interaction.reply({
      content: "Stopped playing music.",
    });
  },
});
