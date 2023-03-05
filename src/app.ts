import express from "express";
import Compadre from "./structures/compadre";
import config from "./config";
import Database from "./structures/database";
import expressWinston from "express-winston";
import { charityCron } from "./cron";
import { logger } from "./helpers";

const port = config.port;

const app = express();
const database = new Database();
const compadre = new Compadre();

app.use(
  expressWinston.logger({
    winstonInstance: logger.winston,
    statusLevels: true,
  })
);

const init = async () => {
  await database.init();
  await compadre.init();

  charityCron.init(compadre);
};

init();

app.listen(port, () => {
  return logger.info(`Server is listening at http://localhost:${port}.`);
});
