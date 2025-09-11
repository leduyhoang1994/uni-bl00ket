import { createServer } from "http";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import HostController from "./host/host.controller";
import { AuthenticatedSocket } from "./types/socket";

const PORT = 3000;

async function eventHandler(
  eventName: string,
  arg: any,
  socket: AuthenticatedSocket
) {
  const controller = new HostController(socket.user?.hostId || "", socket);
  await controller.init();
}

async function startServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    // options
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      console.log(socket.handshake.auth);
      const user = {
        id: token,
        username: "",
        hostId: "test",
        role: socket.handshake.auth.role,
      };

      (socket as AuthenticatedSocket).user = user;

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: AuthenticatedSocket) => {
    await socket.join(socket.user?.hostId || "");

    socket.onAny(async (eventName, ...args) => {
      await eventHandler(eventName, args, socket);
    });
  });

  logger.info(`Socket server listening on PORT ${PORT}!`);
  httpServer.listen(PORT);
}

startServer();
