import { HostLeaderboard } from "@Common/types/host.type";
import KafkaClient from "../utils/kafka.client";
import logger from "../utils/logger";
import {KafkaTopics} from "../types/topics.type";

export class GameEventPublisherPublisher {
    private static instance: GameEventPublisherPublisher;
    private kafkaClient: KafkaClient;

    private constructor() {
        this.kafkaClient = KafkaClient.getInstance();
        logger.info("[GameEventPublisherPublisher] Initialized");
    }

    static getInstance(): GameEventPublisherPublisher {
        if (!GameEventPublisherPublisher.instance) {
            GameEventPublisherPublisher.instance = new GameEventPublisherPublisher();
        }
        return GameEventPublisherPublisher.instance;
    }

    async publishLeaderboard(
        hostId: string,
        leaderboard: HostLeaderboard,
        options?: {
            retries?: number;
            timeout?: number;
        }
    ): Promise<void> {
        const maxRetries = options?.retries ?? 3;
        const sendTimeout = options?.timeout ?? 10000;

        const producer = await this.kafkaClient.getProducer();

        const message = {
            key: hostId,
            value: JSON.stringify(leaderboard),
            timestamp: Date.now().toString(),
        };

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await producer.send({
                    topic: KafkaTopics.GAME_LEADERBOARD,
                    messages: [message],
                    compression: 1,
                    acks: -1,
                    timeout: sendTimeout,
                });

                logger.info(
                    {hostId, attempt},
                    `[Kafka] Published leaderboard for host ${hostId}`
                );
                return;
            } catch (error: any) {
                logger.debug(
                    {
                        hostId,
                        attempt,
                        error: error?.message,
                    },
                    `[Kafka] Failed to publish leaderboard (attempt ${attempt})`
                );
                if (attempt === maxRetries) {
                    logger.debug(
                        {hostId, error},
                        `[Kafka] Giving up after ${maxRetries} retries`
                    );
                    throw error;
                }
                await new Promise((res) => setTimeout(res, 500 * attempt));
            }
        }
    }
}