import Redis, { Redis as RedisType, Cluster } from "ioredis";
import logger from "./logger";
import { UniError } from "../base/errors/base.error";

export default class RedisClient {
  private static redisClient: RedisType | Cluster | null = null;

  static getClient(): RedisType | Cluster {
    if (this.redisClient) {
      return this.redisClient;
    }

    let client: RedisType | Cluster | null = null;
    const redisType = process.env.REDIS_TYPE || "standalone";
    const redisUrl = process.env.REDIS_CONNECTION_URL;

    if (!redisUrl) {
      throw new UniError(
        "REDIS_CONNECTION_URL is not defined in environment variables"
      );
    }

    if (redisType === "standalone") {
      client = new Redis(redisUrl);
    }

    if (redisType === "cluster") {      
      const clusterNodes = redisUrl.split(";").map((urlStr) => {
        const url = new URL(urlStr);
        return {
          host: url.hostname,
          port: Number(url.port) || 6379,
        };
      });

      client = new Redis.Cluster(clusterNodes);
    }

    if (!client) {
      throw new UniError("Unable to detect Redis connection type");
    }

    client.on("error", (err) => logger.info(`Redis Error: ${err}`));
    client.on("connect", () => logger.info("Redis connected"));
    client.on("reconnecting", () => logger.info("Redis reconnecting"));
    client.on("ready", () => {
      logger.info("Redis ready!");
    });

    this.redisClient = client;

    return this.redisClient;
  }
}
