class BotInfo {
  data = {
    hostNumber: 10,
    botsPerHost: 100,
    botInfo: [],
    events: [],
    errors: [],
    connectedBots: 0,
    errorBots: 0,
  };

  top5ExecutionTimes = [];

  addEvent(event) {
    this.data.events.push(event);
    this.data.events = this.data.events.slice(-50);
  }

  addError(error) {
    this.data.errors.push(error);
    this.data.errors = this.data.errors.slice(-50);
  }

  getErrors() {
    const errors = [];

    errors.push("Top 5 Longest Execution Times:");
    this.top5ExecutionTimes.forEach((timeRecord, index) => {
      errors.push(`${index + 1}. ${timeRecord.text}`);
    });

    errors.push("Error Logs:");

    return [...errors, ...this.data.errors];
  }

  addExecutionTime(timeRecord) {
    this.top5ExecutionTimes.push(timeRecord);
    this.top5ExecutionTimes.sort((a, b) => b.time - a.time);
    this.top5ExecutionTimes = this.top5ExecutionTimes.slice(0, 5);
  }
}

const botInfo = new BotInfo();

export default botInfo;
