import { ConnectionOptions, Queue, Worker } from "bullmq";
import HostRepository from "../host/host.repo";
import HostSocket from "../host/host.socket";
import RedisClient from "../utils/redis.client";
import { Emitter } from "@socket.io/redis-emitter";

const redisConnection: ConnectionOptions = {
  url: process.env.REDIS_CONNECTION_URL,
};

export default class WorkerController {
  private static controller: WorkerController;
  public static HOST_START_JOB = "host-start";
  public static HOST_END_JOB = "host-end";
  private hostTimerQueueName = "host-timer";
  private hostTimerQueue: Queue | null = null;
  private emitter: Emitter | null = null;

  public static async getInstance(): Promise<WorkerController> {
    if (!WorkerController.controller) {
      WorkerController.controller = new WorkerController();
      await WorkerController.controller.init();
    }

    return WorkerController.controller;
  }

  constructor() {
    this.hostTimerQueue = new Queue(this.hostTimerQueueName, {
      connection: redisConnection,
    });
  }

  private async initWorkers() {
    const controller = await WorkerController.getInstance();

    const hostSchedulerWorker = new Worker(
      this.hostTimerQueueName,
      async (job) => {
        switch (job.name) {
          case WorkerController.HOST_START_JOB:
            await controller.onHostStart(job.data.hostId);
            break;
          case WorkerController.HOST_END_JOB:
            await controller.onHostEnd(job.data.hostId);
            break;
        }
      },
      {
        connection: redisConnection,
      }
    );

    hostSchedulerWorker.on("completed", (job) => {
      console.log(`✅ Game started successfully: ${job.data.sessionId}`);
    });

    hostSchedulerWorker.on("failed", (job, err) => {
      console.error(`❌ Game ${job?.data.sessionId} failed:`, err.message);
    });
  }

  public async init() {
    const redisClient = await RedisClient.getClient();
    this.emitter = new Emitter(redisClient);

    await this.initWorkers();
  }

  public async scheduleStart(hostId: string, delay: number) {
    if (!this.emitter) {
      return;
    }

    const hostSocket = new HostSocket(hostId, this.emitter);

    // TODO: Emit Start Time

    await this.hostTimerQueue?.add(
      WorkerController.HOST_START_JOB,
      { hostId },
      {
        delay: delay * 1000,
        removeOnComplete: true,
      }
    );
  }

  public async scheduleEnd(hostId: string, delay: number) {
    // TODO: Emit End Time

    await this.hostTimerQueue?.add(
      WorkerController.HOST_END_JOB,
      { hostId },
      {
        delay: delay * 1000,
        removeOnComplete: true,
      }
    );
  }

  private async onHostStart(hostId: string) {
    if (!this.emitter) {
      return;
    }

    const hostRepo = new HostRepository(hostId);
    const hostSocket = new HostSocket(hostId, this.emitter);

    await hostRepo.start();
    await hostSocket.emitStarted();
  }

  private async onHostEnd(hostId: string) {
    if (!this.emitter) {
      return;
    }

    const hostRepo = new HostRepository(hostId);
    const hostSocket = new HostSocket(hostId, this.emitter);
    await hostRepo.end();
    await hostSocket.emitEnded();
  }
}
