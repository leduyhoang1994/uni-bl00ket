import mongoose from "mongoose";
import logger from "./logger";

let isConnected = false; // Biến trạng thái toàn cục

const connectMongo = async (uri: string | undefined) => {
  if (!uri) {
    logger.debug("[MongoDB] No URI provided")
    return null;
  }

  if (isConnected) {
    // Nếu đã connect rồi thì tái sử dụng
    logger.debug("[MongoDB] Using existing connection");
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 1) {
    // readyState = 1 nghĩa là đã kết nối
    isConnected = true;
    logger.debug("[MongoDB] Connection already ready");
    return mongoose.connection;
  }

  // Nếu chưa có kết nối, tiến hành connect
  logger.debug("[MongoDB] Connecting...");
  await mongoose.connect(uri, {
    // các option (tùy môi trường)
    dbName: process.env.MONGO_DB_NAME,
    maxPoolSize: 10, // Giới hạn kết nối
  });

  isConnected = true;
  logger.debug("[MongoDB] Connected successfully");
  return mongoose.connection;
};

export default connectMongo;
