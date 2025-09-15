import { AuthenticatedUser } from "@Common/types/socket.type";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: Omit<AuthenticatedUser, "socketId">;
}