import express from "express";
import Compadre from "./structures/compadre";
import config from "./config";
import Database from "./structures/database";
import expressWinston from "express-winston";
import { charityCron } from "./cron";
import { logger } from "./helpers";
import {
  authRouter,
  guildRouter,
  loggingRouter,
  memberRouter,
  notificationRouter,
  preventRouter,
  roleRouter,
  welcomeRouter,
} from "./routes";

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

app.use("/auth", authRouter);
app.use("/guild", guildRouter);
app.use("/logging", loggingRouter);
app.use("/member", memberRouter);
app.use("/notification", notificationRouter);
app.use("/prevent", preventRouter);
app.use("/role", roleRouter);
app.use("/welcome", welcomeRouter);

const init = async () => {
  await database.init();
  await compadre.init();

  charityCron.init(compadre);
};

init();

app.listen(port, () => {
  return logger.info(`Server is listening at http://localhost:${port}.`);
});
