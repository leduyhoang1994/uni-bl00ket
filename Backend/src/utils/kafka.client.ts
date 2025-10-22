import { Kafka, Producer, logLevel } from "kafkajs";
import logger from "./logger";
import "dotenv/config";

const kafkaConnection = {
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    clientId: process.env.KAFKA_CLIENT_ID || "uniclass-bloocket-game-backend",
    retry: {
        initialRetryTime: 100,
        retries: 8,
    },
    connectionTimeout: 10000,
    requestTimeout: 30000,
    ssl: false,
    logLevel: logLevel.ERROR,
}
class KafkaClient {
    private static instance: KafkaClient;
    private kafka: Kafka;
    private producer: Producer | null = null;
    private isProducerConnected: boolean = false;

    private constructor() {
        this.kafka = new Kafka(kafkaConnection);
        logger.info(`[KafkaClient] Initialized with brokers: ${kafkaConnection}`);
    }

    static getInstance(): KafkaClient {
        if (!KafkaClient.instance) {
            KafkaClient.instance = new KafkaClient();
        }
        return KafkaClient.instance;
    }
    async getProducer(): Promise<Producer> {
        if (!this.producer) {
            this.producer = this.kafka.producer({
                allowAutoTopicCreation: true,
                idempotent: true,
            });
        }

        if (!this.isProducerConnected) {
            await this.producer.connect();
            this.isProducerConnected = true;
            logger.info("[KafkaClient] Producer connected");

            this.producer.on("producer.disconnect", () => {
                this.isProducerConnected = false;
                logger.debug("[KafkaClient] Producer disconnected");
            });
        }

        return this.producer;
    }

    async disconnect() {
        try {
            if (this.producer && this.isProducerConnected) {
                await this.producer.disconnect();
                this.isProducerConnected = false;
                logger.info("[KafkaClient] Producer disconnected");
            }
        } catch (err) {
            logger.debug("[KafkaClient] Disconnect error:", err);
        }
    }
}

export default KafkaClient;