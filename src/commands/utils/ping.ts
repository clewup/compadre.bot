import { Command } from "../../base/command";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("View your ping.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
      ephemeral: true,
      content: `Latency: \`${
        interaction.createdTimestamp - interaction.createdTimestamp
      }ms\`\nAPI Latency: \`${Math.round(interaction.client.ws.ping)}ms\``,
    });
  },
});
