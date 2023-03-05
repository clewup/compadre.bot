import { Command } from "../../structures/command";
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { Categories } from "../../enums/categories";
import { ErrorReasons } from "../../enums/reasons";
import { openAiService } from "../../services";

/**
 *    @name gpt
 *    @description Asks ChatGPT a question.
 *    The command requires a permission of SendMessages.
 *    @param {string} query - The user query.
 */
export default new Command({
  data: new SlashCommandBuilder()
    .setName("gpt")
    .setDescription("Ask ChatGPT a question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to be sent to ChatGPT.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

  details: {
    category: Categories.CORE,
    enabled: true,
  },

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const question = interaction.options.getString("question");

    if (!question) {
      return await interaction.reply({
        ephemeral: true,
        content: ErrorReasons.INVALID_PARAMETER("question"),
      });
    }

    await interaction.deferReply();
    const gptResponse = await openAiService.askGpt(question);

    await interaction.followUp({
      ephemeral: true,
      content: `${gptResponse}`,
    });
  },
});
