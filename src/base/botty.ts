import {
  Client,
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
import { Player } from "discord-player";
import Soundboard from "./soundboard";

class Botty<Ready extends boolean = boolean> extends Client {
  public logger;
  public functions;
  public commands;
  public player;
  public soundboard;

  constructor() {
    super({
      intents: [
        Intents.Flags.Guilds,
        Intents.Flags.GuildMembers,
        Intents.Flags.GuildMessages,
        Intents.Flags.GuildMessageReactions,
        Intents.Flags.GuildVoiceStates,
        Intents.Flags.DirectMessages,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
      allowedMentions: {
        parse: ["users"],
      },
    });
    this.logger = new Logger();
    this.functions = new Functions();
    this.commands = new Collection<string, Command>();
    this.player = new Player(this);
    this.soundboard = new Soundboard();
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

        if ("data" in command && "execute" in command) {
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

      if ("name" in event && "execute" in event) {
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

export default Botty;
