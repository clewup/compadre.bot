import {Command} from "../base/command";
import {ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear a specified amount of messages.")
        .addIntegerOption(option => option
            .setName("amount")
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    async execute(interaction: ChatInputCommandInteraction<'cached'>) {
        const amount = interaction.options.getInteger("amount");
        const content = `${amount} messages cleared.`

        if (!amount) {
            await interaction.reply({
                content: 'Please provide an amount.',
                ephemeral: true
            })
        }

        else {
            interaction.channel?.bulkDelete(amount, true);
            await interaction.reply({
                ephemeral: true,
                content
            });
        }
    }
})