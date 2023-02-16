import {EventClass} from "../base/event";
import {Events} from "discord.js";

export default new EventClass({
        name: Events.MessageCreate,
        async execute(message) {
            if(message.author.bot) return;
            if(!message.content.startsWith("/")) return;
        }
    }
);