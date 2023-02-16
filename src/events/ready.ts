import {Event} from "../base/event";
import {Events} from "discord.js";
import Botty from "../base/botty";

export default new Event({
        name: Events.ClientReady,
        async execute(client) {
            (client as Botty).logger.log(`${client.user.username} is online and serving ${client.users.cache.size} user(s).`)
        }
    }
);