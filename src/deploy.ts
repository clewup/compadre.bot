import { REST, Routes } from "discord.js";
import { Command } from "./base/command.js";

import fs from "node:fs";
import path from "node:path";
import config from "./config";

const commands: any[] = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

const refreshCommands = async () => {
  for (const file of commandFiles) {
    const filePath = `${commandsPath}/${file}`;
    let command = await import(filePath);
    command = command.default;

    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(
    config.discordClientToken || ""
  );

  await (async () => {
    try {
      let data: string | any[];

      data = (await rest.put(
        Routes.applicationCommands(config.discordApplicationId || ""),
        { body: commands }
      )) as Command["data"][];

      console.log(`Successfully refreshed ${data.length} commands.`);
    } catch (error) {
      console.error(error);
    }
  })();
};

refreshCommands();
