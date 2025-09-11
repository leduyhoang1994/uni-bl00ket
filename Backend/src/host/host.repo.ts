import logger from "../utils/logger";
import HostModel from "./host.model";

export default class HostRepository {
  private hostId: string;
  private hostModel: HostModel | null = null;

  constructor(hostId: string) {
    this.hostId = hostId;
  }

  public async get() {
    if (this.hostModel) {
      return this.hostModel;
    }

    this.hostModel = await this.getById(this.hostId);

    return this.hostModel;
  }

  private async getById(hostId: string) {
    return new HostModel();
  }

  public async start() {
    if (await this.hasStarted()) {
      logger.info("Game has already Started");
      return;
    }

    logger.info("Host Started");
    this.hostModel?.start();
  }

  public async hasStarted() {
    return this.hostModel?.started;
  }
}
