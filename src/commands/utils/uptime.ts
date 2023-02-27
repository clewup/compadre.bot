import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/**
 *    @name uptime
 *    @description Returns the bot's uptime.
 *    The command requires a permission of SendMessages.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("View compadre's uptime.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: "Utils",
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    let seconds = Math.floor(interaction.client.uptime! / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    await interaction.reply({
      ephemeral: true,
      content: `I have been awake for ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`,
    });
  },
});
