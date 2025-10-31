import axios from "axios";
import botInfo from "./logger.js";

export const gameServer = () => {
  // return process.env.GAME_SERVER || "http://localhost:3000";
  // return process.env.GAME_SERVER || "https://lab-game-api.uniclass.com.vn";
  return process.env.GAME_SERVER || "https://ws-game.uniclass.vn";
};

// gen random unique name
export const randomName = () => {
  return `bot_${Math.random().toString(36).substring(2, 10)}`;
};

export const httpClient = axios.create({
  baseURL: gameServer(),
  headers: { "Content-Type": "application/json" },
});

// add action if client has execution time greater than 5s
httpClient.interceptors.request.use(
  (config) => {
    const startTime = new Date().getTime();
    config.metadata = { startTime };
    return config;
  },
  (error) => {
    return null;
  }
);

httpClient.interceptors.response.use(
  (response) => {
    const endTime = new Date().getTime();
    const startTime = response.config.metadata.startTime;
    const executionTime = endTime - startTime;

    botInfo.addExecutionTime({
      text: `Client request to ${response.config.url} took ${executionTime} ms`,
      time: executionTime,
    });

    return response;
  },
  (error) => {
    botInfo.addError(
      `Error in request to ${error.config?.url}: ${error.message}`
    );
    return null;
  }
);

export const authUser = async (name, hostId) => {
  const response = await httpClient.post("host/gen-token", {
    username: name,
    hostId,
    reuseUser: true,
    avatar: "https://game.uniclass.vn/images/cafe-game/customers/chick.svg",
  });

  return response.data.data.token;
};

export const getHostInfo = async (hostId, token) => {
  const response = await httpClient.post(
    "host/info",
    { hostId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data.hostInfo;
};

export function generateRandomText(sizeInBytes) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?-=[];,./`~';
  let result = "";
  const charactersLength = characters.length;

  // Calculate the number of characters needed for the desired byte size.
  // Assuming 1 character = 1 byte for simplicity with ASCII-like characters.
  // For more complex multi-byte characters, a more precise calculation would be needed.
  const numberOfCharacters = sizeInBytes;

  for (let i = 0; i < numberOfCharacters; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const fiveKbText = () => generateRandomText(5 * 1024);
