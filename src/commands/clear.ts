import {Command} from "../base/command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import Botty from "../base/botty";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear a specified amount of messages.") as SlashCommandBuilder,
    opt: {
        userPermissions: ['ManageMessages'],
        botPermissions: ['ManageMessages'],
        category: 'General',
        cooldown: 5,
        visible: true,
        guildOnly: false,
    },
    async execute(interaction: ChatInputCommandInteraction<'cached'>, args) {
        const value = args[0];
        const content = `${value} messages cleared.`

        interaction.channel?.bulkDelete(value, true);
        await interaction.reply({
            ephemeral: true,
            content
        });
    }
})