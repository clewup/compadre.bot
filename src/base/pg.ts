import {Client} from 'pg';
import 'dotenv/config'
import Logger from "../helpers/logger";

class Pg extends Client {
    public logger;

    constructor() {
        super({
            connectionString: process.env.DATABASE_URL,
        });
        this.logger = new Logger();
    }

    public async start() {
        try {
            this.logger.logInfo('Initializing database.')
            await super.connect();
        }
        catch (error) {
            this.logger.logError(`Could not initialize database (${error})`)
        }
    }
}

export default Pg;