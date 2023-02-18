import express from 'express';
import Botty from './base/botty'
import 'dotenv/config'
import {Events} from "discord.js";
import Pg from "./base/pg";

const port = process.env.PORT;

const app = express();
const pg = new Pg();
const botty = new Botty();

pg.start();

botty.login(process.env.DISCORD_CLIENT_TOKEN);
botty.start();

botty
    .on(Events.ShardDisconnect, () => botty.logger.logInfo("Bot Disconnected"))
    .on(Events.ShardReconnecting, () => botty.logger.logInfo("Bot Reconnecting"))
    .on(Events.ShardError, (e) => botty.logger.logError(e))
    .on(Events.Error, (e) => botty.logger.logError(e))
    .on(Events.Warn, (info) => botty.logger.logWarning(info));

app.listen(port, () => {
    //return console.log(`Express is listening at http://localhost:${port}`);
});