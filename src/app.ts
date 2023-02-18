import express from 'express';
import Botty from './base/botty'
import 'dotenv/config'
import {Events} from "discord.js";

const port = process.env.PORT;

const app = express();
const client = new Botty();

client.login(process.env.CLIENT_TOKEN);
client.start();

client
    .on(Events.ShardDisconnect, () => client.logger.logInfo("Bot Disconnected"))
    .on(Events.ShardReconnecting, () => client.logger.logInfo("Bot Reconnecting"))
    .on(Events.ShardError, (e) => client.logger.logError(e))
    .on(Events.Error, (e) => client.logger.logError(e))
    .on(Events.Warn, (info) => client.logger.logWarning(info));

app.listen(port, () => {
    //return console.log(`Express is listening at http://localhost:${port}`);
});