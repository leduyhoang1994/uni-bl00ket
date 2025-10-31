import { input } from "@inquirer/prompts";
import startBot from './bot.js';
import drawUI from './ui.js';
import botInfo from './logger.js';

async function main() {
  // Init bot information
  const botPerHost = await input({
    message: "Number of bots per host:",
    default: "100",
  });
  const hostIds = await input({
    message: "Host IDs (comma separated):",
    default: "683d33",
  });

  startBot(parseInt(botPerHost), hostIds.split(","));
  const hostNumber = hostIds.split(",").length;

  botInfo.data.hostNumber = hostNumber;
  botInfo.data.botsPerHost = parseInt(botPerHost);

  drawUI();
}

main();
