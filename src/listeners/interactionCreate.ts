import { CommandInteraction, Interaction } from "discord.js";
import {commands} from "../commands";
import Botty from "../base/botty";

export default (client: Botty): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Botty, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = commands.find(c => c.name === interaction.commandName);

    if (!slashCommand) {
        await interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};