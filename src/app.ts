import express from "express";
import Botty from "./base/botty";
import { Events } from "discord.js";
import config from "./config";
import Database from "./base/database";
import Logger from "./helpers/logger";

const port = config.port;

const app = express();
const database = new Database();
const botty = new Botty();
const logger = new Logger();

const init = async () => {
  await database.start();
  await botty.start();
};

init();

botty
  .on(Events.ShardDisconnect, () => botty.logger.logInfo("Bot Disconnected"))
  .on(Events.ShardReconnecting, () => botty.logger.logInfo("Bot Reconnecting"))
  .on(Events.ShardError, (e) => botty.logger.logError(e))
  .on(Events.Error, (e) => botty.logger.logError(e))
  .on(Events.Warn, (info) => botty.logger.logWarning(info));

app.listen(port, () => {
  return logger.logInfo(`Server is listening at http://localhost:${port}.`);
});
