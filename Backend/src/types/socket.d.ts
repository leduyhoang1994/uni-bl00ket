import { Socket } from "socket.io";
import { AuthenticatedUser } from "@Common/types/socket.type";

interface AuthenticatedSocket extends Socket {
  user?: AuthenticatedUser;
}

