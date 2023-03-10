import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Categories } from "../../enums/categories";

/**
 *    @name hello
 *    @description A simple greeting.
 *    The command requires a permission of SendMessages.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("A simple greeting.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.CORE,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
      ephemeral: true,
      content: `Hello, ${interaction.user.username}`,
    });
  },
});
