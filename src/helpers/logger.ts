import { createLogger, format, transports } from "winston";

/**
 *    @class
 *    Creates a new instance of Logger.
 */

export default class Logger {
  readonly winston;

  constructor() {
    const logFormat = format.printf(
      ({ level, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level}] : ${message} `;
        if (metadata) {
          msg += JSON.stringify(metadata);
        }
        return msg;
      }
    );

    this.winston = createLogger({
      transports: [
        new transports.Console(),
        new transports.File({
          filename: "logs.log",
        }),
      ],
      format: format.combine(format.splat(), format.timestamp(), logFormat),
    });
  }

  info(message: unknown) {
    this.winston.info(`${message}`);
  }
  warning(message: unknown) {
    this.winston.warn(`${message}`);
  }
  error(message: unknown) {
    this.winston.error(`${message}`);
  }
  db(message: unknown) {
    this.winston.debug(`${message}`);
  }
}
