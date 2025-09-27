export type AuthenticatedUser = {
  id: string;
  username: string;
  hostId: string;
  role: "host" | "player";
  avatar: string; // Avatar được lấy ra trong JWT có thể out of date, cần lấy avatar thật từ trong DB
  socketId: string;
};
