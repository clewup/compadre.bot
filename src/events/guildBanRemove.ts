import {EventClass} from "../base/event";
import {Events} from "discord.js";

export default new EventClass({
        name: Events.GuildBanRemove,
        async execute(guildBan) {}
    }
);