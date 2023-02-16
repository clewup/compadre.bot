import express from 'express';
import Botty from './base/botty'

require('dotenv').config();
const port = process.env.PORT;

const app = express();
const client = new Botty();

client.start(client);

client.on("disconnect", () => client.logger.log("Bot Disconnected", "log"))
    .on("reconnecting", () => client.logger.log("Bot Reconnecting", "log"))
    .on("error", (e) => client.logger.log(e, "log"))
    .on("warn", (info) => client.logger.log(info, "log"));

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});