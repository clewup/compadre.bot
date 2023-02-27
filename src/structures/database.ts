import { Prisma, PrismaClient } from "@prisma/client";
import Logger from "../helpers/logger";
import config from "../config";

/**
 *    @extends PrismaClient
 *    @class
 *    Creates a new instance of Database.
 */
class Database extends PrismaClient<
  Prisma.PrismaClientOptions,
  "query" | "error" | "warn"
> {
  public logger;

  constructor() {
    super({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
    });
    this.$on("query", (e) => {
      this.logger.logDb(`${e.query}, ${e.params}, ${e.duration}ms`);
    });
    this.$on("error", (e) => {
      this.logger.logError(`${e.message}`);
    });
    this.$on("warn", (e) => {
      this.logger.logWarning(`${e.message}`);
    });
    this.logger = new Logger();
  }

  public async start() {
    try {
      this.logger.logInfo("Initializing database connection.");
      await this.$connect();
      await this.$disconnect();
    } catch (error) {
      this.logger.logError(`Could not initialize the database (${error}).`);
    }
  }
}

export default Database;
