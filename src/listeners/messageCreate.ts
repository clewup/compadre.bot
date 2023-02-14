import {Client, Message} from "discord.js";

export default (client: Client): void => {
    client.on("messageCreate", async (message) => {
        await handleMessageAction(client, message);
    });
};

const handleMessageAction = async (client: Client, message: Message<boolean>): Promise<void> => {

};