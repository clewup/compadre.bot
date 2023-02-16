import {Event} from "../base/event";
import {Events} from "discord.js";

export default new Event({
        name: Events.MessageDelete,
        async execute(message) {
            if(message.author?.bot) return;
            if(!message.content?.startsWith("/")) return;
        }
    }
);