import { Socket } from "socket.io";

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    hostId: string;
    role: "host" | "player";
  }; // Define your user object structure
}
