import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

/*
 *    Shows the bot uptime.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("View the bot's uptime.")
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
      content: `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
    });
  },
});
