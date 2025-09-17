import { RedisClientType, createClient } from "redis";
import logger from "./logger";

export default class RedisClient {
  private static redisClient: RedisClientType<any> | null = null;

  static async getClient(): Promise<RedisClientType<any>> {
    if (this.redisClient) {
      return this.redisClient;
    }

    const client: RedisClientType<any> = createClient({
      url: process.env.REDIS_CONNECTION_URL,
    });

    client.on("error", (err) => logger.info(`Redis Error: ${err}`));
    client.on("connect", () => logger.info("Redis connected"));
    client.on("reconnecting", () => logger.info("Redis reconnecting"));
    client.on("ready", () => {
      logger.info("Redis ready!");
    });

    await client.connect();
    this.redisClient = client;

    return this.redisClient;
  }
}
