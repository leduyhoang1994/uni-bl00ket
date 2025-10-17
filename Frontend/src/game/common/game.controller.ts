import HostController from "@/game/host/controller";
import { initInternalHttp } from "@/game/common/utils/http.util";
import { HostEvent } from "@common/constants/event.constant";
import { InternalHttpRoute } from "@common/constants/http.constant";
import { GameEvent } from "@common/types/host.type";
import { Socket } from "socket.io-client";
import { Question } from "@common/types/game.type";

class GameController {
  private socketClient: Socket | null = null;
  protected hostId: string;
  protected totalQuestions: number = 0;
  protected totalCorrectAnswers: number = 0;
  protected questions: Question[] = [];
  protected currentQuestion: Question | null = null;
  protected score: number = 0;
  protected randomQuestion: () => Question = this.createRandomPicker(
    this.questions
  );

  constructor(hostId: string, questions: Question[] = []) {
    this.hostId = hostId;

    // init Questions
    this.questions = questions;
    this.randomQuestion = this.createRandomPicker(this.questions);
  }

  createRandomPicker<T>(items: T[]) {
    let used = new Set<number>();

    return function pick(): T {
      if (used.size === items.length) {
        // reset khi đã lấy hết
        used.clear();
      }

      let index: number;
      do {
        index = Math.floor(Math.random() * items.length);
      } while (used.has(index));

      used.add(index);
      return items[index];
    };
  }

  protected getSaveData(data: any = {}) {
    return {
      totalCorrectAnswers: this.totalCorrectAnswers,
      totalQuestions: this.totalQuestions,
      currentQuestion: this.currentQuestion,
      ...data,
    };
  }

  protected async loadSavedGame() {
    const sessionData = sessionStorage.getItem("savedGame");
    if (sessionData) {
      return JSON.parse(sessionData);
    }

    const accessToken = await HostController.getAccessToken();
    if (!accessToken) {
      return;
    }

    const client = await initInternalHttp(accessToken);
    const gameData = await client.post(
      InternalHttpRoute.GetGameData,
      JSON.stringify({ hostId: this.hostId })
    );

    return gameData.data.gameData;
  }

  protected async saveGame(online: boolean = false) {
    if (!this.socketClient) {
      return;
    }

    sessionStorage.setItem("savedGame", JSON.stringify(this.getSaveData()));

    if (online) {
      this.socketClient.emit(HostEvent.SaveGame, this.getSaveData());
    }
  }

  public setSocketClient(client: Socket) {
    this.socketClient = client;
  }

  public getSocketClient() {
    return this.socketClient;
  }

  public onScoreUpdate: (score: number) => Promise<void> = async (score) => {
    this.socketClient?.emit(HostEvent.ScoreUpdated, score);
    await this.saveGame(true);
  };

  protected async saveActivity(activity: any) {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.SaveActivity, activity);
  }

  public getQuestion(): Question {
    this.currentQuestion = this.randomQuestion();
    console.log(this.currentQuestion);
    this.currentQuestion.answers?.sort(() => Math.random() - 0.5);
    this.totalQuestions += 1;

    this.saveGame();

    return this.currentQuestion;
  }

  public answerQuestion(
    answerId: string,
    action?: (correct: boolean) => void
  ): { correct: boolean; message: string } {
    if (!this.currentQuestion) {
      return { correct: false, message: "No question has been asked yet" };
    }

    const isCorrect = this.currentQuestion.correctAnswerId === answerId;
    if (!isCorrect) {
      if (action) action(false);
      return { correct: false, message: "Wrong answer." };
    }

    if (action) action(true);

    this.totalCorrectAnswers += 1;
    this.saveGame(true);
    return { correct: true, message: "OK" };
  }

  protected emitGameEvent(event: GameEvent) {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.GameEvent, event);
  }

  public async handleGameEvent(event: GameEvent) {}

  public socketEventHandler(eventName: HostEvent, ...args: any) {
    switch (eventName) {
      case HostEvent.GameEvent:
        this.handleGameEvent(args[0]);
        break;
    }
  }

  protected updateScore(score: number) {
    this.score = score;
    this.onScoreUpdate(this.score);
  }

  public decodeActivity(activity: any): string | undefined {
    return "New Activities";
  }
}

export default GameController;
