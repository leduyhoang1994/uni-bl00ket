import { io } from "socket.io-client";
import { authUser, fiveKbText, gameServer, getHostInfo } from "./utils.js";
import botInfo from "./logger.js";

const botId = (id) => `bot_${id}`;

export default async function startBot(botCount, hostList) {
  for (let i = 0; i < hostList.length; i++) {
    const hostId = hostList[i];
    for (let i = 0; i < botCount; i++) {
      botInfo.addEvent(`Starting bot ${botId(i + 1)} for host ${hostId}`);

      await createBot(hostId, `${hostId}_bot_${i + 1}`);
    }
  }
}

function updateScore(socket) {
  const score = Math.floor(Math.random() * 1000);
  socket.emit("host:score-updated", score);
  botInfo.addEvent(`Bot ${socket.id} updated score ${score}`);

  // randomly save game with 10% chance
  if (Math.random() < 0.5) {
    botInfo.addEvent(`Bot ${socket.id} saved game`);
    saveGame(socket);
  }
}

function saveGame(socket) {
  socket.emit("game:save", {
    longText: fiveKbText(),
  });
}

function simulatePlay(socket) {
  const randomTime = Math.floor(Math.random() * 15000) + 5000;

  setInterval(() => {
    updateScore(socket);
  }, randomTime);
}

async function createBot(hostId, id) {
  const botName = `bot_${id}`;
  const token = await authUser(botName, hostId);

  if (!token) {
    botInfo.addError(`Bot ${botName} failed to authenticate for host ${hostId}`);
    return;
  }

  const socketClient = io(gameServer(), {
    transports: ["websocket"],
    auth: {
      token: token,
      hostId: hostId,
    },
  });

  socketClient.on("connect", async () => {
    botInfo.data.connectedBots += 1;
    const hostInfo = await getHostInfo(hostId, token);
    if (!hostInfo) {
      botInfo.addError(`Bot ${botName} failed to get host info for host ${hostId}`);
      return;
    }
    
    const isInGame = hostInfo.state === "in-game";

    botInfo.addEvent(`Bot ${botName} connected to host ${hostId}`);

    if (isInGame) {
      simulatePlay(socketClient);
    } else {
      socketClient.on("host:lobby-started", (data) => {
        simulatePlay(socketClient);
      });
    }
  });

  socketClient.on("disconnect", () => {
    botInfo.data.connectedBots -= 1;

    botInfo.addEvent(`Bot ${botName} disconnected from host ${hostId}`);
  });
}
