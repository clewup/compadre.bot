import { Prisma, PrismaClient } from "@prisma/client";
import { logger } from "../helpers";

/**
 *    @extends PrismaClient
 *    @class
 *    Creates a new instance of Database.
 */
class Database extends PrismaClient<
  Prisma.PrismaClientOptions,
  "query" | "error" | "warn"
> {
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
      logger.db(`${e.query}, ${e.params}, ${e.duration}ms`);
    });
    this.$on("error", (e) => {
      logger.error(`${e.message}`);
    });
    this.$on("warn", (e) => {
      logger.warning(`${e.message}`);
    });
  }

  async init() {
    try {
      logger.info("Initializing database connection.");
      await this.$connect();
      await this.$disconnect();
    } catch (error) {
      logger.error(`Could not initialize the database (${error}).`);
    }
  }
}

export default Database;
