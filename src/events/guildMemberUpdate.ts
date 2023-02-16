import {EventClass} from "../base/event";
import {Events} from "discord.js";

export default new EventClass({
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {}
    }
);