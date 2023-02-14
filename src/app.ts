import express from 'express';
import {Client, IntentsBitField as Intents } from 'discord.js'
import ready from './listeners/ready';
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";


require('dotenv').config();
const port = process.env.PORT;
const token = process.env.CLIENT_TOKEN;

const app = express();
const client = new Client({intents: [Intents.Flags.Guilds, Intents.Flags.GuildMessages, Intents.Flags.MessageContent]});

ready(client);
interactionCreate(client);

client.login(token);

messageCreate(client);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});