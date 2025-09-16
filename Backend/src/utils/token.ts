import ShortUniqueId from "short-unique-id";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../servers/api.server";
import { Player } from "@Common/types/host.type";

export const hexRnd = new ShortUniqueId({
  dictionary: "hex",
});

export async function getPayloadFromAuth(auth: any): Promise<{
  id: string;
  username: string;
  hostId: string;
  role: "host" | "player";
  avatar: string;
}> {  
  if (auth.token.startsWith("Host")) {
    return {
      id: "host",
      username: "Host",
      hostId: auth.hostId,
      role: "host",
      avatar: "",
    };
  }
  
  const token = auth.token;
  const payload = jwt.verify(token, JWT_SECRET) as Player;
  return {
    id: payload.id,
    username: payload.username,
    hostId: auth.hostId,
    role: "player",
    avatar: payload.avatar,
  };
}
