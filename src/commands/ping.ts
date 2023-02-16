import {Command} from "../base/command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import Botty from "../base/botty";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("View your ping.") as SlashCommandBuilder,
    opt: {
        userPermissions: ['SendMessages'],
        botPermissions: ['SendMessages'],
        category: 'General',
        cooldown: 5,
        visible: true,
        guildOnly: false,
    },
    async execute(interaction: ChatInputCommandInteraction<'cached'>) {
        const content = `Latency: \`${interaction.createdTimestamp - interaction.createdTimestamp}ms\`\nAPI Latency: \`${Math.round(interaction.client.ws.ping)}ms\``

        await interaction.reply({
            ephemeral: true,
            content
        });
    }
})