// import CafeController from "@/bases/controllers/cafe.controller";
// import initHttp from "@/utils/http.util";
import crypto from "crypto";
import { io } from "socket.io-client";

const hostId = "81eb7f";

async function genToken() {
  const userId = crypto.randomBytes(8).toString("hex");
  const avatar = `/images/avatar/brown-dog.svg`;
  const username = `testuser-${crypto.randomBytes(4).toString("hex")}`;

  const result = await fetch("http://localhost:8300/host/gen-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hostId,
      userId,
      avatar,
      username,
    }),
  });
  const data = await result.json();

  // console.log(`Generated token for ${username}: ${data.data.token}`);

  return data.data.token;
}

function getRandomFloat(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

async function executeTest(token) {
  // let cafeController = new CafeController(hostId);
  // const httpClient = await initHttp(token);

  const socketClient = io("http://localhost:8300", {
    transports: ["websocket"],
    extraHeaders: {
      "X-User-ID": crypto.randomBytes(4).toString("hex"),
    },
    auth: {
      token: token,
      hostId: hostId,
    },
  });

  socketClient.on("connect", async () => {
    console.log(`Connected: ${socketClient.id}`);
    // const gameData = await httpClient.post("/host/get-game-data", { hostId });
    // cafeController.loadData(gameData.data);
    // cafeController.setSocketClient(socketClient);
  });

  socketClient.on("connect_error", async (err) => {
    console.log(`Error: ${err}`);
    // const gameData = await httpClient.post("/host/get-game-data", { hostId });
    // cafeController.loadData(gameData.data);
    // cafeController.setSocketClient(socketClient);
  });

  socketClient.on("host:lobby-started", () => {
    console.log(`Lobby started`);

    setInterval(() => {
      socketClient.emit("host:score-updated", getRandomFloat(5000, 10000));
      console.log(`Score updated by ${socketClient.id}`);
    }, getRandomFloat(5000, 10000));
  });

  socketClient.connect();
}

async function main() {
  const concurrency = 5000;

  for (let i = 0; i < concurrency; i++) {
    const token = await genToken();
    executeTest(token);
  }
}

main();
