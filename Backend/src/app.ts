import { createServer } from "http";
import app from "./servers/api.server";
import { createSocketServer } from "./servers/socket.server";
import connectMongo from "./utils/mongo.client";
import logger from "./utils/logger";
import "dotenv/config";
import WorkerController from "./servers/worker.server";
import KafkaClient from "./utils/kafka.client";
import { isLocalEnvironment } from "./utils/util";

async function bootstrap() {
  const port = parseInt(process.argv[2]) || 4000;

  logger.debug(`Starting server on port ${port}...`);
  await connectMongo(
    process.env.MONGO_CONNECTION_URL || "mongodb://mongodb_server:27017/bl00ket"
  );

  // Tạo HTTP server từ app Express
  const httpServer = createServer(app);

  // Tạo socket server
  createSocketServer(httpServer);

  await WorkerController.getInstance();

  if (!isLocalEnvironment()) {
    logger.info("Initializing Kafka...");
    const kafkaClient = KafkaClient.getInstance();
    kafkaClient.getProducer();
    logger.info("✅ Kafka producer connected");
  }

  // Start cả API và Socket trên cùng 1 cổng
  httpServer.listen(port, () => {
    logger.debug(`API + Socket server running on ${port} . . .`);
  });
}

bootstrap();
