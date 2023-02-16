class Logger {
    public log(message: unknown) {
        const dateTime = new Date().toISOString();
        console.log(`${dateTime}: ${message}`)
    }
}
export default Logger;