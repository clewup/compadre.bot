import { REST, Routes } from 'discord.js';
import { Command } from './base/command.js';
import 'dotenv/config';

import fs from 'node:fs';
import path from "node:path";

const commands: any[] = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

const refreshCommands = async () => {
    for (const file of commandFiles) {
        const filePath = `${commandsPath}/${file}`;
        let command = await import(filePath);
        command = command.default;

        commands.push(command.data.toJSON());
    };

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_CLIENT_TOKEN!);

    await (async () => {
        try {
            let data: string | any[];

            data = await rest.put(
                Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!),
                {body: commands},
            ) as Command['data'][];

            console.log(`Successfully refreshed ${data.length} commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
}

refreshCommands();



