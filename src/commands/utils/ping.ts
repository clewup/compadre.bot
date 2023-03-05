import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Categories } from "../../enums/categories";

/**
 *    @name ping
 *    @description Returns the user's latency to the bot and the API.
 *    The command requires a permission of SendMessages.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.UTILITIES,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
      ephemeral: true,
      content: `Latency: \`${
        interaction.createdTimestamp - interaction.createdTimestamp
      }ms\`\nAPI Latency: \`${Math.round(interaction.client.ws.ping)}ms\``,
    });
  },
});
