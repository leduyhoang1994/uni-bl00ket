import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";
import { Player } from "@Common/types/host.type";
import { AuthenticatedUser } from "../../../Common/types/socket.type";
import { HostEvent } from "@Common/constants/event.constant";

export default class HostSocket {
  private socket: AuthenticatedSocket;
  private hostId: string;

  constructor(hostId: string, socket: AuthenticatedSocket) {
    this.hostId = hostId;
    this.socket = socket;
  }

  public getUser(): AuthenticatedUser | null {
    return this.socket.user || null;
  }

  public getUserRole(): "host" | "player" | null {
    const user = this.getUser();
    if (!user) {
      logger.debug("User not found");
      return null;
    }  

    return user.role;
  }

  public async kick(socketId: string) {
    logger.debug(`Socket exist: ${this.socket.nsp.server.sockets.sockets.has(socketId)}`);
    this.socket.nsp.server.sockets.sockets.get(socketId)?.disconnect(true);
  }

  public async emitStarted() {
    await this.emitRoom(HostEvent.LobbyStarted);
  }

  public async emitLobbyUpdated(palyers: Player[]) {
    this.emitRoom(HostEvent.LobbyUpdated, palyers);
  }

  public async emitUserInfo() {
    this.socket.emit(HostEvent.UserInfo, this.socket.user);
  }

  protected async emitRoom(eventName: string, arg: any = null) {
    this.socket.nsp.server.to(this.hostId).emit(eventName, arg);
  }
}
