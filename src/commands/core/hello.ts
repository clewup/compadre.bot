import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/*
 *    Greet the bot.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello!")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: "Core",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
      ephemeral: true,
      content: `Hello, ${interaction.user.username}`,
    });
  },
});
