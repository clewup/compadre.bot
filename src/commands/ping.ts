import {ICommand} from "../types/command";

export const Ping: ICommand = {
    name: "ping",
    description: "Pong",
    run: async (client, interaction) => {
        const content = `Latency: \`${interaction.createdTimestamp - interaction.createdTimestamp}ms\`\nAPI Latency: \`${Math.round(client.ws.ping)}ms\``
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}