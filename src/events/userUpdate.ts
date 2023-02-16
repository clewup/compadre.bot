import {EventClass} from "../base/event";
import {Events} from "discord.js";

export default new EventClass({
        name: Events.UserUpdate,
        async execute(user) {
        }
    }
);