import {
  Client as DiscordClient,
  Collection,
  IntentsBitField as Intents,
  Partials,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord.js";
import Logger from "../helpers/logger";
import Functions from "../helpers/functions";
import { Command } from "./command";
import fs from "node:fs";
import path from "node:path";
import config from "../config";
import Soundboard from "./soundboard";
import GptService from "../services/gptService";
import GuildService from "../services/guildService";
import LoggingService from "../services/loggingService";
import MemberService from "../services/memberService";
import NotificationService from "../services/notificationService";
import PreventService from "../services/preventService";
import RoleService from "../services/roleService";
import WelcomeService from "../services/welcomeService";
import Database from "./database";

/**
 *    @extends DiscordClient
 *    @class
 *    Creates a new instance of Compadre.
 */
class Compadre<Ready extends boolean = boolean> extends DiscordClient {
  readonly logger: Logger;
  readonly functions: Functions;
  readonly commands: Collection<string, Command>;
  readonly soundboard: Soundboard;

  readonly services: {
    gptService: GptService;
    guildService: GuildService;
    loggingService: LoggingService;
    memberService: MemberService;
    notificationService: NotificationService;
    preventService: PreventService;
    roleService: RoleService;
    welcomeService: WelcomeService;
  };

  constructor() {
    super({
      intents: [
        Intents.Flags.Guilds,
        Intents.Flags.GuildMembers,
        Intents.Flags.GuildMessages,
        Intents.Flags.GuildMessageReactions,
        Intents.Flags.GuildVoiceStates,
        Intents.Flags.DirectMessages,
        Intents.Flags.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
      allowedMentions: {
        parse: ["users"],
      },
    });

    this.logger = new Logger();
    this.functions = new Functions();
    this.commands = new Collection<string, Command>();
    this.soundboard = new Soundboard();

    this.services = {
      gptService: new GptService(),
      guildService: new GuildService(),
      loggingService: new LoggingService(),
      memberService: new MemberService(),
      notificationService: new NotificationService(),
      preventService: new PreventService(),
      roleService: new RoleService(),
      welcomeService: new WelcomeService(),
    };
  }

  private async setCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFolders = fs.readdirSync(commandsPath);

    this.logger.logInfo(`Initializing commands.`);

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${commandsPath}/${folder}`)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, folder, file);
        let command = await import(filePath);
        command = command.default;

        if (
          command.data &&
          command.details &&
          command.execute &&
          command.details.enabled === true
        ) {
          this.commands.set(command.data.name, command);
        } else {
          this.logger.logWarning(
            `The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
  }

  private async setEvents() {
    const eventsPath = path.join(__dirname, "..", "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    this.logger.logInfo(`Initializing events.`);
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      let event = await import(filePath);
      event = event.default;

      if (event.name && event.execute) {
        if (event.once) {
          this.once(event.name, (...args) => event.execute(...args));
        } else {
          this.on(event.name, (...args) => event.execute(...args));
        }
      } else {
        this.logger.logWarning(
          `The event at ${filePath} is missing a required "name" or "execute" property.`
        );
      }
    }
  }

  public async start() {
    await this.setCommands();
    await this.setEvents();
    await this.login(config.discordClientToken);
  }
}

export default Compadre;
