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
        this.logger = Logger;
        this.functions = Functions;
        this.commands = new Collection<string, CommandClass>();
    }

    private async loadModules(client: Botty) {
        commands.forEach((command) => {
            if (command.data && !!command.execute) {
                this.commands.set(command.data.name, command);
            }
            else {
                this.logger.log("A command is not setup correctly.", "log");
            }
        })

        guildBanAdd(client);
        guildBanRemove(client);
        guildMemberUpdate(client);
        messageCreate(client);
        messageDelete(client);
        roleCreate(client);
        roleDelete(client);
        roleUpdate(client)
        userUpdate(client);
    }

    public async start(client: Botty) {
        ready(client);
        interactionCreate(client);
        await this.login(process.env.CLIENT_TOKEN);
        await this.loadModules(client);
    }
}

export default Botty;