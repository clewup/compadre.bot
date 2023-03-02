import { Command } from "../../structures/command";
import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder,
} from "discord.js";
import {Categories} from "../../data/enums/categories";
import GptService from "../../services/gptService";

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
    },

    async execute(interaction: ChatInputCommandInteraction<"cached">) {
        const question = interaction.options.getString("question");

        if (!question) {
            return await interaction.reply({
                ephemeral: true,
                content: "Please provide a question.",
            });
        }

        await interaction.deferReply();
        const gptService = new GptService();
        const gptResponse = await gptService.askGpt(question);

        await interaction.followUp({
            ephemeral: true,
            content: `${gptResponse}`,
        });
    },
});
