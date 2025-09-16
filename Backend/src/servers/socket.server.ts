import { Server } from "socket.io";
import HostController from "../host/host.controller";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";
import { getPayloadFromAuth as getPayloadFromAuth } from "../utils/token";
import HostSocket from "../host/host.socket";

async function userConnectedHandler(socket: AuthenticatedSocket) {
  const hostId = socket.user?.hostId || "";
  socket.join(HostSocket.publicRoom(hostId));

  if (socket.user?.role === "host") {
    socket.join(HostSocket.privateRoom(hostId));
  }

  const controller = new HostController(hostId, socket);

  controller.join();

  socket.onAny((eventName, ...args) =>
    controller.eventHandler(eventName, ...args)
  );

  socket.on("disconnect", () => {
    logger.debug("User disconnected");
    controller.leave();
  });
}

export async function createSocketServer(httpServer: any) {
  const socketServer = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  socketServer.use(async (socket, next) => {
    const auth = socket.handshake.auth;
    try {
      const payload = await getPayloadFromAuth(auth);

      (socket as AuthenticatedSocket).user = {
        ...payload,
        socketId: socket.id,
      };

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  socketServer.on("connection", userConnectedHandler);
}
