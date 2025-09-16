import GameController from "@/bases/controllers/game.controller";
import { io, Socket } from "socket.io-client";

let socketClient: Socket | null = null;

export default function initSocketClient(
  hostId: string,
  accessToken: string,
  controller?: GameController
) {
  if (socketClient) {
    return socketClient;
  }
  
  socketClient = io("http://localhost:3000", {
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

  if (controller) {
    socketClient.onAny((eventName, ...args) => {
      controller.socketEventHandler(eventName, ...args);
    });
    controller.setSocketClient(socketClient);
  }

  socketClient.connect();

  return socketClient;
}
