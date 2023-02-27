import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";

/**
 *    @name unlock
 *    @description Unlocks the channel in which the command was executed.
 *    The command requires a permission of ManageChannels.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock the channel.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  details: {
    category: "Moderation",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    let channel = interaction.channel;

    interaction.guild.roles.cache.forEach((role) => {
      if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
        channel?.permissionOverwrites.delete(role);
      }
    });

    await interaction.reply({
      ephemeral: true,
      content: "The channel has been unlocked.",
    });
  },
});
