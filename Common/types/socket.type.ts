export type AuthenticatedUser = {
  id: string;
  username: string;
  hostId: string;
  role: "host" | "player";
  avatar: string;
  socketId: string;
};
