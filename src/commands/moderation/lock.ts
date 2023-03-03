import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { Categories } from "../../data/enums/categories";

/**
 *    @name lock
 *    @description Locks the channel in which the command was executed.
 *    The command requires a permission of ManageChannels.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the channel.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  details: {
    category: Categories.MODERATION,
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
