import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Permissions} from "../../data/enums/permissions";

/**
 *    @name resume
 *    @description Resumes the currently paused song.
 *    The command requires a permission of Administrator.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the currently paused song.")
    .setDefaultMemberPermissions(Permissions.MUSIC),

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

    queue.setPaused(false);

    return await interaction.reply({
      content: "Resumed the music.",
    });
  },
});
