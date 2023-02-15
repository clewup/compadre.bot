import {Message} from "discord.js";
import Botty from "../base/botty";

export default (client: Botty): void => {
    client.on("messageCreate", async (message) => {
        await handleMessageAction(client, message);
    });
};

const handleMessageAction = async (client: Botty, message: Message<boolean>): Promise<void> => {

};