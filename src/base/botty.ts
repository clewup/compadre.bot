import {Client, IntentsBitField as Intents} from "discord.js";
import Logger from "../helpers/logger";
import Functions from "../helpers/functions";

class Botty extends Client {
    public logger;
    public functions;

    constructor() {
        super({intents: [
                Intents.Flags.Guilds,
                Intents.Flags.GuildMembers,
                Intents.Flags.GuildMessages,
                Intents.Flags.GuildMessageReactions,
                Intents.Flags.GuildVoiceStates,
                Intents.Flags.DirectMessages
            ],
            allowedMentions: {
                parse: ["users"]
            }
        });
        this.logger = Logger;
        this.functions = Functions;
    }
}

export default Botty;