import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionOverwrites,
  PrivateThreadChannel,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
} from "discord.js";

/*
 *    Clears messages from a channel.
 *    <params="amount (number)"/>
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
