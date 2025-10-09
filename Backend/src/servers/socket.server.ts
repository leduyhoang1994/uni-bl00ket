import { Server } from "socket.io";
import HostSocketHandler from "../host/host-socket.handler";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";
import { getPayloadFromAuth as getPayloadFromAuth } from "../utils/token";
import HostSocket from "../host/host.socket";
import { createAdapter } from "@socket.io/redis-adapter";
import RedisClient from "../utils/redis.client";

async function userConnectedHandler(socket: AuthenticatedSocket) {
  const hostId = socket.user?.hostId || "";
  socket.join(HostSocket.publicRoom(hostId));

  if (socket.user?.role === "host") {
    socket.join(HostSocket.privateRoom(hostId));
  }

  const socketHandler = new HostSocketHandler(hostId, socket);

  socketHandler.join();

  socket.onAny((eventName, ...args) =>
    socketHandler.eventHandler(eventName, ...args)
  );

  socket.on("disconnect", () => {
    logger.debug("User disconnected");
    socketHandler.leave();
  });
}

export async function createSocketServer(httpServer: any) {
  const socketServer = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const pubClient = await RedisClient.getClient();
  const subClient = pubClient.duplicate();

  await subClient.connect();
  
  socketServer.adapter(createAdapter(pubClient, subClient));

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
