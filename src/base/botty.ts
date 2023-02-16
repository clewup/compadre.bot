import {Client, Collection, IntentsBitField as Intents} from "discord.js";
import Logger from "../helpers/logger";
import Functions from "../helpers/functions";
import {CommandClass} from "./command";
import {commands} from "../commands";
import guildBanAdd from "../events/guildBanAdd";
import guildBanRemove from "../events/guildBanRemove";
import guildMemberUpdate from "../events/guildMemberUpdate";
import messageCreate from "../events/messageCreate";
import messageDelete from "../events/messageDelete";
import roleCreate from "../events/roleCreate";
import roleDelete from "../events/roleDelete";
import roleUpdate from "../events/roleUpdate";
import userUpdate from "../events/userUpdate";
import ready from "../events/ready";
import interactionCreate from "../events/interactionCreate";
import {events} from "../events";
import functions from "../helpers/functions";

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
        this.commands = new Collection<string, CommandClass>();
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