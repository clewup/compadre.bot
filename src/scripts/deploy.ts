import { REST, Routes } from "discord.js";
import { Command } from "../structures/command";

import fs from "node:fs";
import path from "node:path";
import config from "../config";
import Logger from "../helpers/logger";

const logger = new Logger();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands: any[] = [];

const commandsPath = path.join(__dirname, "..", "commands");
const commandFolders = fs.readdirSync(commandsPath);

const refreshCommands = async () => {
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`${commandsPath}/${folder}`)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = `${commandsPath}/${folder}/${file}`;
      let command = await import(filePath);
      command = command.default;

      if (
        command.data &&
        command.details &&
        command.execute &&
        command.details.enabled === true
      ) {
        commands.push(command.data.toJSON());
      }
    }
  }

  const rest = new REST({ version: "10" }).setToken(
    config.discordClientToken || ""
  );

  await (async () => {
    try {
      const data = (await rest.put(
        Routes.applicationCommands(config.discordApplicationId || ""),
        { body: commands }
      )) as Command["data"][];

      logger.info(`Successfully refreshed ${data.length} commands.`);
    } catch (error) {
      logger.error(error);
    }
  })();
};

refreshCommands();
