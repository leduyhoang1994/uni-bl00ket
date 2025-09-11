import { Socket } from "socket.io";
import HostModel from "./host.model";
import HostRepository from "./host.repo";
import HostSocket from "./host.socket";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";

export default class HostController {
  private hostId: string;
  private hostRepo: HostRepository;
  private hostSocket: HostSocket;

  constructor(hostId: string, socket: AuthenticatedSocket) {
    this.hostId = hostId;
    this.hostRepo = new HostRepository(hostId);
    this.hostSocket = new HostSocket(hostId, socket);
  }

  public async init() {}

  public async create() {
    await this.onCreated();
  }
  public async onCreated() {}

  public async join() {
    await this.onJoined();
  }
  public async onJoined() {}

  public async leave() {
    await this.onLeaved();
  }
  public async onLeaved() {}

  public async start() {
    await this.hostRepo.start();
    await this.onStarted();
  }
  public async onStarted() {
    await this.hostSocket.emitStart();
  }
}
