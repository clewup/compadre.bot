import {ICommand} from "../types/command";

export const Hello: ICommand = {
    name: "hello",
    description: "Say hello!",
    run: async (client, interaction) => {
        const content = "Hello there!"
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}