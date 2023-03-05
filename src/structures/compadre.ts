import {
  Client as DiscordClient,
  Collection,
  Events,
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
import { logger } from "../helpers";

/**
 *    @extends DiscordClient
 *    @class
 *    Creates a new instance of Compadre.
 */
class Compadre<Ready extends boolean = boolean> extends DiscordClient {
  readonly commands: Collection<string, Command>;

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

    this.commands = new Collection<string, Command>();

    this.on(Events.ShardDisconnect, () => logger.info("Bot Disconnected"))
      .on(Events.ShardReconnecting, () => logger.info("Bot Reconnecting"))
      .on(Events.ShardError, (e) => logger.error(e))
      .on(Events.Error, (e) => logger.error(e))
      .on(Events.Warn, (info) => logger.warning(info));
  }

  private async setCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFolders = fs.readdirSync(commandsPath);

    logger.info(`Initializing commands.`);

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
        } else if (command.details.enabled === false) {
          logger.warning(`The command at ${filePath} is disabled.`);
        } else {
          logger.warning(
            `The command at ${filePath} is missing a required "data", "details" or "execute" property.`
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

    logger.info(`Initializing events.`);
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
        logger.warning(
          `The event at ${filePath} is missing a required "name" or "execute" property.`
        );
      }
    }
  }

  async init() {
    await this.setCommands();
    await this.setEvents();
    await this.login(config.discordClientToken);
  }
}

export default Compadre;
