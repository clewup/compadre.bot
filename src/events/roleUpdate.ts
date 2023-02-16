import {Event} from "../base/event";
import {Events} from "discord.js";

export default new Event({
        name: Events.GuildRoleUpdate,
        async execute(role) {
        }
    }
);