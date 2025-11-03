class Logger {
  private formatTime() {
    const now = new Date();
    return now.toISOString();
  }

  public info(...args: any[]) {
    console.log(`[INFO] [${this.formatTime()}]`, ...args);
  }

  public debug(...args: any[]) {
    console.log(`[DEBUG] [${this.formatTime()}]`, ...args);
  }
}

const logger = new Logger();
export default logger;
