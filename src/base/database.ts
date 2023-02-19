import { Sequelize } from "sequelize-typescript";
import config from "../config";
import Logger from "../helpers/logger";
import User from "../models/user";
import Guild from "../models/guild";

class Database extends Sequelize {
  public logger;

  constructor() {
    super(config.databaseUrl || "", {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: (message) => this.logger.logDb(message),
      models: [User, Guild],
    });
    this.logger = new Logger();
  }

  public async start() {
    try {
      this.logger.logInfo("Initializing database connection.");
      await this.authenticate();
      await this.sync({ force: config.forceDatabaseReset });
    } catch (error) {
      this.logger.logError(`Could not initialize the database (${error})`);
    }
  }
}
export default Database;
