import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Permissions} from "../../data/enums/permissions";

/**
 *    @name clear
 *    @description Clears the song queue.
 *    The command requires a permission of Administrator.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the song queue.")
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
    if (!queue)
      return await interaction.reply({
        content: "No music is being played!",
      });

    queue.clear();

    return await interaction.reply({
      content: "Cleared the song queue.",
    });
  },
});
