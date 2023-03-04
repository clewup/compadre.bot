import express from "express";
import Compadre from "./structures/compadre";
import { Events } from "discord.js";
import config from "./config";
import Database from "./structures/database";

const port = config.port;

const app = express();
const database = new Database();
const compadre = new Compadre();

const init = async () => {
  await database.start();
  await compadre.start();
};

init();

compadre
  .on(Events.ShardDisconnect, () => compadre.logger.logInfo("Bot Disconnected"))
  .on(Events.ShardReconnecting, () =>
    compadre.logger.logInfo("Bot Reconnecting")
  )
  .on(Events.ShardError, (e) => compadre.logger.logError(e))
  .on(Events.Error, (e) => compadre.logger.logError(e))
  .on(Events.Warn, (info) => compadre.logger.logWarning(info));

app.listen(port, () => {
  return compadre.logger.logInfo(
    `Server is listening at http://localhost:${port}.`
  );
});
