import express from 'express';
import Botty from './base/botty'
import 'dotenv/config'

const port = process.env.PORT;

const app = express();
const client = new Botty();

client.start(client);

client.on("disconnect", () => client.logger.log("Bot Disconnected"))
    .on("reconnecting", () => client.logger.log("Bot Reconnecting"))
    .on("error", (e) => client.logger.log(e))
    .on("warn", (info) => client.logger.log(info));

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});