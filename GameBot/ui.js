import termkit from "terminal-kit";
import botInfo from "./logger.js";
const term = termkit.terminal;

let title, bots, events, errors;

const drawFrame = (screenBuffer, label) => {
  screenBuffer.fill({ attr: { bgColor: "black" } });
  screenBuffer.put(
    { x: 0, y: 0, attr: {} },
    "┌" + "─".repeat(screenBuffer.width - 2) + "┐"
  );
  for (let i = 1; i < screenBuffer.height - 1; i++) {
    screenBuffer.put({ x: 0, y: i, attr: {} }, "│");
    screenBuffer.put({ x: screenBuffer.width - 1, y: i, attr: {} }, "│");
  }
  screenBuffer.put(
    { x: 0, y: screenBuffer.height - 1, attr: {} },
    "└" + "─".repeat(screenBuffer.width - 2) + "┘"
  );
  screenBuffer.put({ x: 2, y: 0, attr: {} }, label);
};

function initFrame() {
  term.clear();

  const heightPercent = (percent, add = 0) =>
    Math.floor(term.height * (percent / 100)) + add;
  const widthPercent = (percent, add = 0) =>
    Math.floor(term.width * (percent / 100)) + add;

  title = new termkit.ScreenBuffer({
    dst: term,
    width: term.width,
    height: 3,
  });

  bots = new termkit.ScreenBuffer({
    dst: term,
    y: 4,
    width: widthPercent(30, 1),
    height: term.height - 3,
  });

  events = new termkit.ScreenBuffer({
    dst: term,
    x: widthPercent(30, 2),
    y: 4,
    width: widthPercent(30),
    height: term.height - 3,
  });

  errors = new termkit.ScreenBuffer({
    dst: term,
    x: widthPercent(60, 2),
    y: 4,
    width: widthPercent(40),
    height: term.height - 3,
  });

  return { title, bots, events, errors };
}

const drawTitleFrame = () => {
  drawFrame(title, "Bot Management UI");
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  const statisticLines = [
    `Memory RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    `Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    `Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    `CPU User: ${(cpuUsage.user / 1000).toFixed(2)} ms`,
    `CPU System: ${(cpuUsage.system / 1000).toFixed(2)} ms`,
  ];
  title.put(
    { x: 2, y: 1, newLine: true, wrap: true },
    statisticLines.join(" | ")
  );
  title.draw();
};

const drawBotFrame = () => {
  drawFrame(bots, "Bots");
  const botData = botInfo.data;

  const botLines = [
    `Total Bots: ${botData.hostNumber * botData.botsPerHost}`,
    `Host Number: ${botData.hostNumber}`,
    `Bots per Host: ${botData.botsPerHost}`,
    `Connected Bots: ${botData.connectedBots}`,
    `Error Bots: ${botData.errorBots}`,
  ];

  bots.put({ x: 2, y: 1, newLine: true, wrap: true }, botLines.join("\n"));
  bots.draw();
};

const drawEventsFrame = () => {
  drawFrame(events, "Events");
  const botData = botInfo.data;
  const lastEvents = botData.events.slice(-events.height + 2);
  events.put({ x: 2, y: 1, newLine: true, wrap: true }, lastEvents.join("\n"));
  events.draw();
};

const drawErrorsFrame = () => {
  drawFrame(errors, "Errors");
  const lastErrors = botInfo.getErrors().slice(-errors.height + 2);
  errors.put({ x: 2, y: 1, newLine: true, wrap: true }, lastErrors.join("\n"));
  errors.draw();
};

const updateUI = () => {
  drawTitleFrame();
  drawBotFrame();
  drawEventsFrame();
  drawErrorsFrame();
};

export default function drawUI() {
  setInterval(() => {
    updateUI(botInfo.data);
  }, 200);

  term.grabInput();

  term.on("key", (name) => {
    if (name === "CTRL_C") {
      term.clear();
      process.exit();
    }
  });

  term.on("resize", () => {
    initFrame();
  });

  initFrame();
}
