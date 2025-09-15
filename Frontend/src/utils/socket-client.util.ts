import GameController from "@/bases/controllers/game.controller";
import { io } from "socket.io-client";

export default function initSocketClient(hostId: string, accessToken: string, controller: GameController) {
  const socketClient = io("http://localhost:3000", {
    auth: {
      token: accessToken,
      hostId: hostId,
    },
  });

  socketClient.on("connect", () => {
    console.log("Connected to server");
  });

  socketClient.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socketClient.onAny((eventName, ...args) => {
    controller.socketEventHandler(eventName, ...args);
  });
  controller.setSocketClient(socketClient);

  socketClient.connect();

  return socketClient;
}
