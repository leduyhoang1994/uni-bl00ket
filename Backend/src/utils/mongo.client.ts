import mongoose from "mongoose";
import logger from "./logger";

let isConnected = false;

const connectMongo = async (uri: string | undefined) => {
  if (!uri) {
    logger.debug("[MongoDB] No URI provided")
    return null;
  }

  if (isConnected) {
    logger.debug("[MongoDB] Using existing connection");
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    logger.debug("[MongoDB] Connection already ready");
    return mongoose.connection;
  }

  logger.debug("[MongoDB] Connecting...");
  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME,
    maxPoolSize: 10,
  });

  isConnected = true;
  logger.debug("[MongoDB] Connected successfully");
  return mongoose.connection;
};

export default connectMongo;
