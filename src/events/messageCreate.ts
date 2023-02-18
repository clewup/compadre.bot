import {Event} from "../base/event";
import {ChannelFlagsBitField, Colors, EmbedBuilder, Events, TextChannel} from "discord.js";

export default new Event({
        name: Events.MessageCreate,
        async execute(message) {
            if(message.author.bot) return;
            if(message.content.startsWith("/")) return;
        }
    }
);