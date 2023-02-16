import { Collection, Events, bold, inlineCode } from 'discord.js';

import {Event} from "../base/event";
import Botty from "../base/botty";

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (!interaction.inCachedGuild()) return;

        const botty = interaction.client as Botty;

        const command = botty.commands.get(interaction.commandName);

        if (!command?.data) {
            interaction.reply({
                content: `⚠️ There is no command matching ${inlineCode(interaction.commandName)}!`,
                ephemeral: true,
            });
            botty.logger.log(`No command matching ${interaction.commandName} was found.`);
            return;
        };

        if (command.opt?.guildOnly && interaction.channel?.isDMBased()) {
            interaction.reply({
                content: 'This command can only be used in a guild.',
                ephemeral: true
            });
            return;
        };

        if (command.opt?.userPermissions) {
            const missingUserPerms = botty.functions.missingPerms(interaction.member.permissionsIn(interaction.channel!), command.opt?.userPermissions) ?
                botty.functions.missingPerms(interaction.member.permissionsIn(interaction.channel!), command.opt?.userPermissions) :
                botty.functions.missingPerms(interaction.memberPermissions, command.opt?.userPermissions);

            if (missingUserPerms?.length) {
                interaction.reply({
                    content: `You need the following permission${missingUserPerms.length > 1 ? "s" : ""}: ${missingUserPerms.map(x => inlineCode(x)).join(", ")}`,
                    ephemeral: true
                });
                return;
            };
        };

        if (command.opt?.botPermissions) {
            const missingBotPerms = botty.functions.missingPerms(interaction.guild.members.me?.permissionsIn(interaction.channel!), command.opt?.botPermissions) ?
                botty.functions.missingPerms(interaction.guild.members.me?.permissionsIn(interaction.channel!), command.opt?.botPermissions) :
                botty.functions.missingPerms(interaction.guild.members.me?.permissions, command.opt?.botPermissions);

            if (missingBotPerms?.length) {
                interaction.reply({
                    content: `I need the following permission${missingBotPerms.length > 1 ? "s" : ""}: ${missingBotPerms.map(x => inlineCode(x)).join(", ")}`,
                    ephemeral: true
                });
                return;
            };
        };


        try {
            await command.execute(interaction);
        } catch (error) {
            await interaction.reply({
                content: `There was an error while executing this command. \nCheck the console for more info.`,
                ephemeral: true
            });
            botty.logger.log(`Error executing ${interaction.commandName}: ${error}`);
        }
    }
});