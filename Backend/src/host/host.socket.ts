import { Socket } from "socket.io";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";

export default class HostSocket {
  private socket: AuthenticatedSocket;
  private hostId: string;

  constructor(hostId: string, socket: AuthenticatedSocket) {
    this.hostId = hostId;
    this.socket = socket;
  }

  public getUser() {
    return this.socket.user;
  }

  public async emitStart() {
    await this.emitRoom("Started");
  }

  protected async emitRoom(eventName: string, arg: any = null) {
    this.socket.nsp.server.to(this.hostId).emit(eventName, arg);
  }
}
