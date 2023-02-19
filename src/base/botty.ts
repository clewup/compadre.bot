import {
  Client,
  Collection,
  IntentsBitField as Intents,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord.js";
import Logger from "../helpers/logger";
import Functions from "../helpers/functions";
import { Command } from "./command";
import fs from "node:fs";
import path from "node:path";
import config from "../config";

class Botty<Ready extends boolean = boolean> extends Client {
  public logger;
  public functions;
  public commands;

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
      allowedMentions: {
        parse: ["users"],
      },
    });
    this.logger = new Logger();
    this.functions = new Functions();
    this.commands = new Collection<string, Command>();
  }

  private async setCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    this.logger.logInfo(`Initializing commands.`);
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
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

  // /*private async refreshCommands() {
  //     const commands: (RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[] = [];
  //     this.commands.forEach((command) => {
  //         console.log(JSON.stringify(command.data));
  //     })
  //
  //     try {
  //         this.logger.log("Refreshing commands");
  //         await this.rest.put(`/${config.discordClientToken}/commands`, {
  //             body: commands,
  //         })
  //         this.logger.log(`Successfully refreshed application (/) commands.`);
  //     }
  //     catch (error) {
  //         this.logger.log(error);
  //     }
  // }*/

  public async start() {
    await this.setCommands();
    await this.setEvents();
    await this.login(config.discordClientToken);
  }
}

export default Botty;
