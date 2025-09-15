import HostRepository from "./host.repo";
import HostSocket from "./host.socket";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";
import { HOST_COMMANDS, HostEvent } from "@Common/constants/event.constant";

export default class HostController {
  private hostId: string;
  private hostRepo: HostRepository;
  private hostSocket: HostSocket | null = null;

  constructor(hostId: string, socket?: AuthenticatedSocket) {
    this.hostId = hostId;
    this.hostRepo = new HostRepository(hostId);
    if (socket) {
      this.hostSocket = new HostSocket(hostId, socket);
    }
  }

  public async init() {}

  public async create() {
    await this.onCreated();
  }
  public async onCreated() {}

  public async join() {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    const user = this.hostSocket.getUser();
    if (!user) {
      logger.debug("User not found");
      return;
    }

    if (user.role == "host") {
      logger.debug(`Host ${user.id} joined`);
      this.hostSocket.emitLobbyUpdated(await this.hostRepo.getPlayers());
      return;
    }

    await this.hostRepo.join(user);
    await this.onJoined();
  }
  public async onJoined() {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    this.hostSocket.emitLobbyUpdated(await this.hostRepo.getPlayers());
    console.log("emit user info");

    this.hostSocket.emitUserInfo();
  }

  public async leave() {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    const user = this.hostSocket.getUser();
    if (!user) {
      logger.debug("User not found");
      return;
    }

    await this.hostRepo.leave(user);
    await this.onLeaved();
  }
  public async onLeaved() {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    await this.hostSocket.emitLobbyUpdated(await this.hostRepo.getPlayers());
  }

  public async kickUser(userId: string) {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    const user = await this.hostRepo.getPlayerById(userId);
    if (!user) {
      logger.debug("User not found");
      return;
    }

    logger.debug(`User ${user.id} kicked`, user);
    await this.hostRepo.kickUser(user);
    await this.hostSocket.kick(user.socketId);
    await this.onKicked(user);
  }
  public async onKicked(user: any) {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    await this.hostSocket.emitLobbyUpdated(await this.hostRepo.getPlayers());
  }

  public async start() {
    if (await this.hostRepo.hasStarted()) {
      logger.debug("Game has already started");
      return;
    }

    await this.hostRepo.start();
    await this.onStarted();
  }
  public async onStarted() {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    await this.hostSocket.emitStarted();
  }

  public async saveGameData(gameData: any) {
    if (!this.hostSocket) {
      return;
    }

    await this.hostRepo.saveGameData(
      this.hostId,
      (this.hostSocket.getUser() as any).id,
      JSON.stringify(gameData)
    );
  }

  public async eventHandler(eventName: HostEvent, ...args: any) {
    if (!this.hostSocket) {
      logger.debug("Host socket not found");
      return;
    }

    if (
      HOST_COMMANDS.includes(eventName) &&
      this.hostSocket.getUserRole() !== "host"
    ) {
      logger.debug("User is not a host");
      return;
    }

    switch (eventName) {
      case HostEvent.LobbyStart:
        await this.start();
        break;
      case HostEvent.Kick:
        await this.kickUser(args[0] as string);
        break;
      case HostEvent.SaveGame:
        await this.saveGameData(args[0]);
        break;
    }
  }
}
