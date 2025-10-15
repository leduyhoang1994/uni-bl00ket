import { QUESTIONS } from "@/model/model";
import { initInternalHttp } from "@/utils/http.util";
import initSocketClient from "@/utils/socket-client.util";
import { getHost } from "@/utils/utils";
import { HostEvent } from "@common/constants/event.constant";
import { InternalHttpRoute } from "@common/constants/http.constant";
import { Question } from "@common/types/game.type";
import {
  ActivityBoardItem,
  GetHostInfoOpts,
  HostInfo,
  HostLeaderboard,
  Player,
} from "@common/types/host.type";
import { AuthenticatedUser } from "@common/types/socket.type";
import { Axios } from "axios";
import { io, Socket } from "socket.io-client";

export default class HostController {
  private static controller: HostController;
  private socketClient: Socket | null = null;
  private httpClient: Axios | null = null;
  private loadedQuestions: Question[] = [];
  private hostInfo: HostInfo | null = null;

  // callbacks
  public onLobbyUpdated: (players: Player[] | Player) => Promise<void> =
    async () => {};
  public onConnected: () => Promise<void> = async () => {};
  public onError: (error: any) => Promise<void> = async () => {};
  public onUserInfo: (user: AuthenticatedUser) => Promise<void> =
    async () => {};
  public onGameStarted: () => Promise<void> = async () => {};
  public onLeaderBoardUpdated: (leaderBoard: HostLeaderboard) => Promise<void> =
    async () => {};
  public onGameEnded: () => Promise<void> = async () => {};
  public onActivitySaved: (activity: ActivityBoardItem) => Promise<void> =
    async () => {};

  public async initHttp() {
    const token = await HostController.getAccessToken();

    if (!token) {
      console.log("Không có token");
      return;
    }

    this.httpClient = await initInternalHttp(token, true);
  }

  public async initSocket(hostId: string) {
    if (this.socketClient) {
      return this.socketClient;
    }

    const accessToken = await HostController.getAccessToken();

    if (!accessToken) {
      console.log("Không có token");
      return;
    }

    if (!hostId) {
      console.log("Không có hostId");
      return;
    }

    this.socketClient = initSocketClient(hostId, accessToken);

    this.socketClient.on("connect", async () => {
      if (!this.socketClient) {
        console.log("Không thể kết nối tới server");

        return;
      }
      console.log("Đã kết nối tới server với ID:", this.socketClient.id);
      await this.onConnected();
    });

    await this.eventHandler(this.socketClient);

    this.socketClient.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    this.socketClient.on("error", (error: any) => {
      console.error("Error from server:", error);
    });

    this.socketClient.connect();

    return this.socketClient;
  }

  public setHostInfo(hostInfo: HostInfo) {
    this.hostInfo = hostInfo;
  }

  public async eventHandler(socket: Socket) {
    socket.onAny(async (event, ...args) => {
      // console.log(`Nhận được sự kiện: ${event}`, ...args);

      if (event === HostEvent.LobbyUpdated) {
        await this.onLobbyUpdated(args[0] as Player[] | Player);
      }

      if (event === HostEvent.UserInfo) {
        await this.onUserInfo(args[0] as AuthenticatedUser);
      }

      if (event === HostEvent.LobbyStart) {
        await this.startGame();
      }

      if (event === HostEvent.LobbyStarted) {
        await this.onGameStarted();
      }

      if (event === HostEvent.LeaderBoardUpdated) {
        await this.onLeaderBoardUpdated(args[0]);
      }

      if (event === HostEvent.GameEnded) {
        await this.onGameEnded();
      }

      if (event === HostEvent.ActivitySaved) {
        await this.onActivitySaved(args[0]);
      }
    });
  }

  public async startGame() {
    if (!this.socketClient) {
      return;
    }
    this.socketClient.emit(HostEvent.LobbyStart);
  }

  public async createGuest(username: string, hostId: string, avatar: string) {
    const client = await initInternalHttp(null);
    let createResult = null;

    try {
      createResult = await client.post(
        InternalHttpRoute.GenToken,
        JSON.stringify({
          username,
          avatar: `${getHost()}/images/cafe-game/customers/${avatar}.svg`,
          hostId,
        })
      );
    } catch (error) {
      return null;
    }

    return createResult?.data.token;
  }

  public async createHost(hostInfo: HostInfo) {
    if (!this.httpClient) {
      await this.initHttp();
    }

    const createResult = await this.httpClient?.post(
      InternalHttpRoute.CreateHost,
      JSON.stringify({
        hostInfo,
      })
    );

    return createResult;
  }

  public async getHostInfo(
    hostId: string,
    options?: GetHostInfoOpts
  ): Promise<HostInfo | null> {
    if (!this.httpClient) {
      await this.initHttp();
    }

    const result = await this.httpClient?.post(
      InternalHttpRoute.GetHostInfo,
      JSON.stringify({ hostId, options })
    );

    return result ? result.data.hostInfo : null;
  }

  public async endGame() {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.EndGame);
  }

  public async getPlayers(hostId: string): Promise<Player[]> {
    if (!this.httpClient) {
      await this.initHttp();
    }

    const result = await this.httpClient?.post(
      InternalHttpRoute.GetPlayers,
      JSON.stringify({ hostId })
    );

    return result ? result.data.players : [];
  }

  public async updateAvatar(hostId: string, avatar: string) {
    if (!this.socketClient) {
      return;
    }

    this.socketClient.emit(HostEvent.UpdateAvatar, {
      hostId,
      avatar,
    });
  }

  public setQuestions(questions?: Question[]) {
    if (
      (!questions || questions.length === 0) &&
      this.hostInfo?.gameSettings?.testing
    ) {
      this.loadedQuestions = QUESTIONS;
      return;
    }

    this.loadedQuestions = questions || [];
  }

  public getQuestions() {
    return this.loadedQuestions;
  }

  public static async saveAccessToken(token: string | null) {
    if (!token) {
      return;
    }

    sessionStorage.setItem("accessToken", token);
  }

  public static async getAccessToken() {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken == "null") {
      return null;
    }

    return accessToken;
  }

  public static async getInstance(): Promise<HostController> {
    if (!HostController.controller) {
      HostController.controller = new HostController();
    }
    return HostController.controller;
  }
}
