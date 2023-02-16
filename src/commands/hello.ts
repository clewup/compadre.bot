import {Command} from "../base/command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import Botty from "../base/botty";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("hello")
        .setDescription("Say hello!") as SlashCommandBuilder,
    opt: {
        userPermissions: ['SendMessages'],
        botPermissions: ['SendMessages'],
        category: 'General',
        cooldown: 5,
        visible: true,
        guildOnly: false,
    },
    async execute(interaction: ChatInputCommandInteraction<'cached'>) {
        const content = `Hello, ${interaction.user.username}.`

        await interaction.reply({
            ephemeral: true,
            content
        });
    }
})