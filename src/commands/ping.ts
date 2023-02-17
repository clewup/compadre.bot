import {Command} from "../base/command";
import {ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import Botty from "../base/botty";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("View your ping.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

    async execute(interaction: ChatInputCommandInteraction<'cached'>) {
        const content = `Latency: \`${interaction.createdTimestamp - interaction.createdTimestamp}ms\`\nAPI Latency: \`${Math.round(interaction.client.ws.ping)}ms\``

        await interaction.reply({
            ephemeral: true,
            content
        });
    }
})