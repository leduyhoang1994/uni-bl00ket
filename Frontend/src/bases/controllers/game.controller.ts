import { HostEvent } from "@common/constants/event.constant";
import { Socket } from "socket.io-client";

export default class GameController {
  private socketClient: Socket | null = null;
  protected hostId: string;

  constructor(hostId: string) {
    this.hostId = hostId;
  }

  public getSaveData() {
    return {};
  }

  protected async saveGame() {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.SaveGame, this.getSaveData());
  }

  public setSocketClient(client: Socket) {
    this.socketClient = client;
  }

  public getSocketClient() {
    return this.socketClient;
  }

  public onScoreUpdate: (score: number) => Promise<void> = async (score) => {
    this.socketClient?.emit(HostEvent.ScoreUpdated, score);
  };

  protected async saveActivity(activity: any) {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.SaveActivity, activity);
  }

  public socketEventHandler(eventName: string, ...args: any) {}
}
