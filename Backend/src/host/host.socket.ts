import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";
import {
  ActivityBoardItem,
  HostLeaderboard,
  Player,
} from "@Common/types/host.type";
import { AuthenticatedUser } from "../../../Common/types/socket.type";
import { HostEvent } from "@Common/constants/event.constant";
import { Emitter } from "@socket.io/redis-emitter";

export default class HostSocket {
  private socket: AuthenticatedSocket | Emitter;
  private hostId: string;

  constructor(hostId: string, socket: AuthenticatedSocket | Emitter) {
    this.hostId = hostId;
    this.socket = socket;
  }

  public getUser(): AuthenticatedUser | null {
    if (this.socket instanceof Emitter) {
      return null;
    }

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
    if (this.socket instanceof Emitter) {
      return null;
    }

    logger.debug(
      `Socket exist: ${this.socket.nsp.server.sockets.sockets.has(socketId)}`
    );
    this.socket.nsp.server.sockets.sockets.get(socketId)?.disconnect(true);
  }

  public async emitStarted() {
    await this.emitRoom(HostEvent.LobbyStarted);
  }

  public async emitLobbyUpdated(palyers: Player[] | Player) {
    this.emitHost(HostEvent.LobbyUpdated, palyers);
  }

  public async emitUserInfo() {
    if (this.socket instanceof Emitter) {
      return null;
    }

    this.socket.emit(HostEvent.UserInfo, this.socket.user);
  }

  public async emitLeaderBoardUpdated(leaderboard: HostLeaderboard) {
    this.emitRoom(HostEvent.LeaderBoardUpdated, leaderboard);
  }

  public async emitEnded() {
    this.emitRoom(HostEvent.GameEnded);
  }

  public async emitActivitySaved(activity: ActivityBoardItem) {
    this.emitHost(HostEvent.ActivitySaved, activity);
  }

  public async emitGameEventToPlayers(
    playerSocketIds: string[] | "all",
    payload: any
  ) {
    if (playerSocketIds === "all") {
      this.emitRoom(HostEvent.GameEvent, payload);
    } else {
      this.emitPlayers(playerSocketIds, HostEvent.GameEvent, payload);
    }
  }

  protected async emitPlayers(
    playerSocketIds: string[],
    eventName: string,
    payload: any
  ) {
    const socketEmitter = this.getSocketEmmiter();

    playerSocketIds.forEach((socketId) => {
      socketEmitter.to(socketId).emit(eventName, payload);
    });
  }

  protected async emitHost(eventName: string, arg: any = null) {
    const socketEmitter = this.getSocketEmmiter();

    socketEmitter.to(HostSocket.privateRoom(this.hostId)).emit(eventName, arg);
  }

  protected async emitRoom(eventName: string, arg: any = null) {
    const socketEmitter = this.getSocketEmmiter();
    socketEmitter.to(HostSocket.publicRoom(this.hostId)).emit(eventName, arg);
  }

  private getSocketEmmiter() {
    if (this.socket instanceof Emitter) {
      return this.socket;
    }

    return this.socket.nsp.server;
  }

  public static publicRoom(hostId: string) {
    return "public-" + hostId;
  }

  public static privateRoom(hostId: string) {
    return "private-" + hostId;
  }
}
