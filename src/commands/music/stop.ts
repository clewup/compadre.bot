import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import {Permissions} from "../../data/enums/permissions";
import {Categories} from "../../data/enums/categories";

/**
 *    @name stop
 *    @description Stops the current song being played, clears the queue and disconnects the bot from the channel.
 *    The command requires a permission of Administrator.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing music and clear the queue.")
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

    queue.destroy();

    return await interaction.reply({
      content: "Stopped playing music.",
    });
  },
});
