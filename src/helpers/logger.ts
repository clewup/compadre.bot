class Logger {
  public log(message: unknown) {
    const dateTime = new Date().toISOString();
    console.log(`${dateTime}: ${message}`);
  }
  public logInfo(message: unknown) {
    const dateTime = new Date().toISOString();
    console.log(`\x1b[36m${dateTime}: [INFO] \x1b[0m${message}`);
  }
  public logWarning(message: unknown) {
    const dateTime = new Date().toISOString();
    console.log(`\x1b[33m${dateTime}: [WARNING] \x1b[0m${message}`);
  }
  public logError(message: unknown) {
    const dateTime = new Date().toISOString();
    console.log(`\x1b[31m${dateTime}: [ERROR] \x1b[0m${message}`);
  }
}
export default Logger;
