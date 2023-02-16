import {Message, PartialMessage} from "discord.js";
import Botty from "../base/botty";

export default (client: Botty): void => {
    client.on("messageDelete", async (message) => {
        await handleMessageDelete(client, message);
    });
};

const handleMessageDelete = async (client: Botty, message: Message<boolean> | PartialMessage): Promise<void> => {
    if(message.author?.bot) return;
    if(!message.content?.startsWith("/")) return;
};