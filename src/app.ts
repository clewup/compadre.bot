import express from "express";
import Compadre from "./structures/compadre";
import { Events } from "discord.js";
import config from "./config";
import Database from "./structures/database";
import expressWinston from "express-winston";
import Logger from "./helpers/logger";
import CharityFunction from "./cron/charity";

const port = config.port;

const app = express();
const database = new Database();
const compadre = new Compadre();
const logger = new Logger();
const charityFunction = new CharityFunction();

app.use(
  expressWinston.logger({
    winstonInstance: logger.winston,
    statusLevels: true,
  })
);

const init = async () => {
  await database.start();
  await compadre.start();

  charityFunction.init(compadre);
};

init();

app.listen(port, () => {
  return compadre.logger.logInfo(
    `Server is listening at http://localhost:${port}.`
  );
});
