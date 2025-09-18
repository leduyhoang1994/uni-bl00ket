import { HostEvent } from "@common/constants/event.constant";
import { GameEventType } from "@common/constants/host.constant";
import { GameEvent } from "@common/types/host.type";
import { Socket } from "socket.io-client";

export default class GameController {
  private socketClient: Socket | null = null;
  protected hostId: string;
  protected totalQuestions: number = 0;
  protected totalCorrectAnswers: number = 0;

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

  protected async emitGameEvent(event: GameEvent) {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.GameEvent, event);
  }

  public async handleGameEvent(event: GameEvent) { }

  public socketEventHandler(eventName: HostEvent, ...args: any) {
    switch (eventName) {
      case HostEvent.GameEvent:
        this.handleGameEvent(args[0]);
        break;
    }
  }
}
