import HostRepository from "./host.repo";
import HostSocket from "./host.socket";
import { AuthenticatedSocket } from "../types/socket";
import logger from "../utils/logger";
import { HOST_COMMANDS, HostEvent } from "@Common/constants/event.constant";
import { HostState } from "@Common/constants/host.constant";

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
      await this.hostSocket.emitLobbyUpdated(await this.hostRepo.getPlayers());
      await this.onLeaderboardUpdated();
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

    const hostState = await this.hostRepo.getHostInfo(this.hostId);
    if (hostState.state === HostState.Lobby) {
      this.hostSocket.emitLobbyUpdated(await this.hostRepo.getPlayers());
    }

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

    const hostInfo = await this.hostRepo.getHostInfo(this.hostId);

    if (hostInfo.state === HostState.Lobby) {
      await this.hostRepo.leave(user);
    }

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

  public async updateLeaderboard(score: number) {
    const user = this.hostSocket?.getUser();
    if (!user) {
      logger.debug("User not found");
      return;
    }

    await this.hostRepo.updateLeaderboard(this.hostId, user.id, score);
    await this.onLeaderboardUpdated();
  }
  private async onLeaderboardUpdated() {
    let leaderBoard = await this.hostRepo.getLeaderboard(this.hostId);
    const players = await this.hostRepo.getPlayers();

    leaderBoard = leaderBoard.map((item) => {
      const player = players.find((p) => p.id === item.playerId);
      return {
        ...item,
        username: player?.username,
        avatar: player?.avatar,
      };
    });

    await this.hostSocket?.emitLeaderBoardUpdated(leaderBoard);
  }

  public async endGame() {
    await this.hostRepo.endGame(this.hostId);
    await this.onGameEnded();
  }
  private async onGameEnded() {
    await this.hostSocket?.emitGameEnded();
  }

  public async saveActivity(payload: any) {
    const user = this.hostSocket?.getUser();
    if (!user) {
      logger.debug("User not found");
      return;
    }

    await this.hostRepo.saveActivity(this.hostId, user.id, payload);
    await this.onActivitySaved(user.id, payload);
  }
  private async onActivitySaved(playerId: any, payload: any) {
    const player = await this.hostRepo.getPlayerById(playerId);
    if (!player) {
      logger.debug("User not found");
      return;
    }

    this.hostSocket?.emitActivitySaved({
      playerId: playerId,
      username: player.username,
      avatar: player.avatar,
      activity: payload,
    });
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
      case HostEvent.ScoreUpdated:
        await this.updateLeaderboard(args[0]);
        const score = args[0];
        logger.debug(`Score updated: ${score}`);
        if (score > 100000) {
          await this.endGame();
        }
        break;
      case HostEvent.EndGame:
        await this.endGame();
        break;
      case HostEvent.SaveActivity:
        await this.saveActivity(args[0]);
        break;
    }
  }
}
