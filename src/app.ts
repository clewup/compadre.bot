import express from 'express';
import {Client, IntentsBitField as Intents } from 'discord.js'
import ready from './listeners/ready';
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import Botty from './base/botty'


require('dotenv').config();
const port = process.env.PORT;
const token = process.env.CLIENT_TOKEN;

const app = express();
const client = new Botty();

const init = async () => {
    ready(client);
    interactionCreate(client);

    await client.login(token);

    messageCreate(client);
}

init();

client.on("disconnect", () => client.logger.log("Bot Disconnected", "log"))
    .on("reconnecting", () => client.logger.log("Bot Reconnecting", "log"))
    .on("error", (e) => client.logger.log(e, "log"))
    .on("warn", (info) => client.logger.log(info, "log"));

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});