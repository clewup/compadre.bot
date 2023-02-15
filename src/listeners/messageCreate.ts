import {Message} from "discord.js";
import Botty from "../base/botty";

export default (client: Botty): void => {
    client.on("messageCreate", async (message) => {
        await handleMessageCreate(client, message);
    });
};

const handleMessageCreate = async (client: Botty, message: Message<boolean>): Promise<void> => {
    if(message.author.bot) return;
    if(!message.content.startsWith("/")) return;
};