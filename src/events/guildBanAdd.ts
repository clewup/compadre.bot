import {Event} from "../base/event";
import {Events} from "discord.js";

export default new Event({
    name: Events.GuildBanAdd,
    async execute(guildBan) {}
    }
);