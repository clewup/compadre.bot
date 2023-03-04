import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Categories } from "../../data/enums/categories";
import { ErrorReasons } from "../../data/enums/reasons";

/**
 *    @name image
 *    @description Displays an image based on a user's prompt.
 *    The command requires a permission of SendMessages.
 *    @param {string} prompt - The user prompt.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Display an image based on a prompt.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to search for.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.CORE,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const prompt = interaction.options.getString("prompt");

    if (!prompt) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_PARAMETER("prompt"),
      });
    }

    await interaction.deferReply();
    const gptService = interaction.client.services.gptService;
    const gptResponse = await gptService.createImage(prompt);

    await interaction.followUp({
      ephemeral: true,
      content: `${gptResponse}`,
    });
  },
});
