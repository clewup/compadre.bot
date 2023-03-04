/**
 *    @class
 *    Creates a new instance of Functions.
 */
import { createLogger, format, transports } from "winston";

class Logger {
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

  public logInfo(message: unknown) {
    this.winston.info(`${message}`);
  }
  public logWarning(message: unknown) {
    this.winston.warn(`${message}`);
  }
  public logError(message: unknown) {
    this.winston.error(`${message}`);
  }
  public logDb(message: unknown) {
    this.winston.debug(`${message}`);
  }
}
export default Logger;
