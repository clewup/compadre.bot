import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";

/*
 *    Clears messages from a channel.
 *    <params="amount (number)"/>
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the channel.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  details: {
    category: "Moderation",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    let channel = interaction.channel;

    interaction.guild.roles.cache.forEach((role) => {
      if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
        channel?.permissionOverwrites.edit(role, {
          ViewChannel: false,
        });
      }
    });

    await interaction.reply({
      ephemeral: true,
      content: "The channel has been locked.",
    });
  },
});
