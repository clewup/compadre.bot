import {Client, Collection, IntentsBitField as Intents} from "discord.js";
import Logger from "../helpers/logger";
import Functions from "../helpers/functions";
import {Command} from "./command";
import {commands} from "../commands";
import {events} from "../events";

class Botty extends Client {
    public logger;
    public functions;
    public commands;

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
        this.logger = new Logger();
        this.functions = new Functions();
        this.commands = new Collection<string, Command>();
    }

    private async loadModules(client: Botty) {
        commands.forEach((command) => {
            if (command.data && !!command.execute) {
                this.commands.set(command.data.name, command);
            }
            else {
                this.logger.log("A command is not setup correctly.");
            }
        })

        events.forEach((event) => {
            if (event.name && !!event.execute) {
                if (event.once) {
                    this.once(event.name, (...args) => event.execute(...args));
                } else {
                    this.on(event.name, (...args) => event.execute(...args));
                }
            }
            else {
                this.logger.log("An event is not setup correctly.");
            }
        })
    }

    public async start(client: Botty) {
        await this.login(process.env.CLIENT_TOKEN);
        await this.loadModules(client);
    }
}

export default Botty;