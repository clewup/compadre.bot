import {Command} from "../base/command";
import {ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import Botty from "../base/botty";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("hello")
        .setDescription("Say hello!")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),

    async execute(interaction: ChatInputCommandInteraction<'cached'>) {
        const content = `Hello, ${interaction.user.username}.`

        await interaction.reply({
            ephemeral: true,
            content
        });
    }
})