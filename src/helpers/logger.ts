interface ILogger {
    log: (message: unknown, logType: string) => void;
}

const Logger: ILogger = {
    log: (message: unknown, logType: string) => {
        const dateTime = new Date().toISOString();

        switch(logType) {
            case "log":
                console.log(`${dateTime}: ${message}`)
        }
    }
}
export default Logger;