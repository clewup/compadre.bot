import express from 'express';
import {Client, IntentsBitField as Intents } from 'discord.js'
import ready from './listeners/ready';
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import Botty from './base/botty'
import guildBanAdd from "./listeners/guildBanAdd";
import guildBanRemove from "./listeners/guildBanRemove";
import guildMemberUpdate from "./listeners/guildMemberUpdate";
import messageDelete from "./listeners/messageDelete";
import roleCreate from "./listeners/roleCreate";
import roleDelete from "./listeners/roleDelete";
import roleUpdate from "./listeners/roleUpdate";
import userUpdate from "./listeners/userUpdate";


require('dotenv').config();
const port = process.env.PORT;
const token = process.env.CLIENT_TOKEN;

const app = express();
const client = new Botty();

const init = async () => {
    ready(client);
    interactionCreate(client);

    await client.login(token);

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

init();

client.on("disconnect", () => client.logger.log("Bot Disconnected", "log"))
    .on("reconnecting", () => client.logger.log("Bot Reconnecting", "log"))
    .on("error", (e) => client.logger.log(e, "log"))
    .on("warn", (info) => client.logger.log(info, "log"));

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});