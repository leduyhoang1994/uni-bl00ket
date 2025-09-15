import ShortUniqueId from "short-unique-id";

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
  const token = auth.token;

  const payload = token.split(".");
  const id = payload[0];
  const role = payload[1];
  const host = auth.hostId || "default";

  return {
    id: id,
    username: id,
    hostId: host,
    role: role === "host" ? "host" : "player",
    avatar: "",
  };
}
