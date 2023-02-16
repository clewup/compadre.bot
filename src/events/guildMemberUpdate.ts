import {Event} from "../base/event";
import {Events} from "discord.js";

export default new Event({
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {}
    }
);