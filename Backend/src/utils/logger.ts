class Logger {
  public info(...args: any) {
    console.log(...args);
  }
}

const logger = new Logger();

export default logger;
