import GameController from "@/game/common/game.controller";
import { GameEventType } from "@common/constants/host.constant";
import { GameEvent, Player } from "@common/types/host.type";

enum GoldQuestGameEvent {
  TakeByPercent = "take-by-percent",
}

export enum Chests {
  Gain10 = "Gain10",
  Gain20 = "Gain20",
  Gain30 = "Gain30",
  Gain40 = "Gain40",
  Gain50 = "Gain50",
  Gain100 = "Gain100",
  Double = "Double",
  Triple = "Triple",
  Lose25 = "Lose25",
  Lose50 = "Lose50",
  Steal10 = "Steal10",
  Steal25 = "Steal25",
  Nothing = "Nothing",
}

export const chestImageMap: Record<Chests, string> = {
  [Chests.Gain10]: "/images/gold-quest/gold.svg",
  [Chests.Gain20]: "/images/gold-quest/gold.svg",
  [Chests.Gain30]: "/images/gold-quest/gold.svg",
  [Chests.Gain40]: "/images/gold-quest/gold.svg",
  [Chests.Gain50]: "/images/gold-quest/gold.svg",
  [Chests.Gain100]: "/images/gold-quest/gold.svg",
  [Chests.Double]: "/images/cafe-game/customers/jester.svg",
  [Chests.Triple]: "/images/cafe-game/customers/unicorn.svg",
  [Chests.Lose25]: "/images/cafe-game/customers/slimemonster.svg",
  [Chests.Lose50]: "/images/cafe-game/customers/dragon.svg",
  [Chests.Steal10]: "/images/cafe-game/customers/elf.svg",
  [Chests.Steal25]: "/images/cafe-game/customers/wizard.svg",
  [Chests.Nothing]: "/images/cafe-game/customers/fairy.svg",
};

export const chestTextMap: Record<Chests, string> = {
  [Chests.Gain10]: "+10 Gold",
  [Chests.Gain20]: "+20 Gold",
  [Chests.Gain30]: "+30 Gold",
  [Chests.Gain40]: "+40 Gold",
  [Chests.Gain50]: "+50 Gold",
  [Chests.Gain100]: "+100 Gold",
  [Chests.Double]: "Double Gold!",
  [Chests.Triple]: "Triple Gold!",
  [Chests.Lose25]: "Lose 25%",
  [Chests.Lose50]: "Lose 50%",
  [Chests.Steal10]: "Take 10%",
  [Chests.Steal25]: "Take 25%",
  [Chests.Nothing]: "Nothing!",
};

const ChestProbabilities = new Map<Chests, number>([
  [Chests.Gain10, 6],
  [Chests.Gain20, 13.5],
  [Chests.Gain30, 17.5],
  [Chests.Gain40, 15],
  [Chests.Gain50, 13.5],
  [Chests.Gain100, 7.5],
  [Chests.Double, 9],
  [Chests.Triple, 4],
  [Chests.Lose25, 3],
  [Chests.Lose50, 1],
  [Chests.Steal10, 4],
  [Chests.Steal25, 4],
  [Chests.Nothing, 2],
]);

enum GoldQuestActivity {
  Steal = "steal",
}

export default class GoldQuestController extends GameController {
  private gold: number = 0;
  private chestsToChoose: Array<Chests> = [];
  public onGoldUpdate: (gold: number) => void = (gold) => { };
  public onGoldStealActive: (player: Player, gold: number) => void = (
    player,
    gold
  ) => { };

  public getSaveData() {
    return super.getSaveData({
      gold: this.gold,
    });
  }

  public async initData() {
    const gameData = await this.loadSavedGame();
    Object.assign(this, gameData);
    this.randomQuestion = this.createRandomPicker(this.questions);
    this.onGoldUpdate(this.gold);
  }

  private setGold(gold: number) {
    gold = Math.round(Math.max(0, gold));
    this.gold = gold;
    this.updateScore(this.gold);
    this.onGoldUpdate(gold);
  }

  public addGold(gold: number) {
    this.setGold(this.gold + gold);
  }

  public subGold(gold: number) {
    this.setGold(this.gold - gold);
  }

  /** Giảm vàng theo % */
  public subGoldPercent(percent: number) {
    this.setGold(this.gold * (1 - percent / 100));
  }

  public getGold() {
    return this.gold;
  }

  private getRandomChests() {
    // Bước 1: Tạo một mảng các vật phẩm có thể thay đổi được từ Map ban đầu.
    let availableChests = Array.from(
      ChestProbabilities,
      ([chest, probability]) => ({
        chest,
        probability,
      })
    );

    // Kiểm tra nếu số lượng yêu cầu lớn hơn số hòm hiện có
    if (3 > availableChests.length) {
      throw new Error(
        "Không thể chọn số lượng hòm nhiều hơn số lượng hiện có."
      );
    }

    const selectedChests = [];

    // Bước 2: Lặp 'count' lần để chọn đủ số hòm.
    for (let i = 0; i < 3; i++) {
      // Bước 3a: Tính tổng xác suất của các hòm CÒN LẠI.
      const totalProbability = availableChests.reduce(
        (sum, item) => sum + item.probability,
        0
      );

      // Bước 3b: Sinh một số ngẫu nhiên trong khoảng từ 0 đến tổng xác suất.
      let randomValue = Math.random() * totalProbability;

      // Bước 3c: Tìm hòm tương ứng với giá trị ngẫu nhiên.
      let chosenIndex = -1;
      for (let j = 0; j < availableChests.length; j++) {
        randomValue -= availableChests[j].probability;
        if (randomValue < 0) {
          chosenIndex = j;
          break;
        }
      }

      // Lấy hòm đã chọn
      const chosenChest = availableChests[chosenIndex];

      // Bước 3d: Thêm hòm đã chọn vào kết quả và xóa khỏi danh sách có thể chọn.
      selectedChests.push(chosenChest.chest);
      availableChests.splice(chosenIndex, 1); // Xóa 1 phần tử tại vị trí chosenIndex
    }

    return selectedChests;
  }

  // Lấy ra 3 rương Random
  public loadRandomChests() {
    this.chestsToChoose = this.getRandomChests();

    // TODO: Fix Cứng, cần bỏ sau khi dev xong
    // this.chestsToChoose = [Chests.Steal10, Chests.Steal25, Chests.Gain100];

    return this.chestsToChoose;
  }

  public getChestByIndex(index: number) {
    const chest = this.chestsToChoose[index];
    return chest;
  }

  public requireChooseTarget(chest: Chests) {
    return [Chests.Steal10, Chests.Steal25].includes(chest);
  }

  public applySteal(player: Player, stealPercent: number) {
    const gold = Math.round((player.score || 0) * (stealPercent / 100));
    this.addGold(gold);

    this.emitGameEvent({
      type: GameEventType.Players,
      targetPlayerIds: [player.id],
      payload: {
        type: GoldQuestGameEvent.TakeByPercent,
        gold,
      },
    });

    this.saveActivity({
      action: GoldQuestActivity.Steal,
      data: {
        targetPlayer: player,
        gold,
      },
    });
  }

  private onStealed(player: Player, gold: number) {
    this.subGold(gold);
    this.onGoldStealActive(player, gold);
  }

  public openChest(chest: Chests, player?: Player) {
    switch (chest) {
      case Chests.Gain10:
        this.addGold(10);
        break;
      case Chests.Gain20:
        this.addGold(20);
        break;
      case Chests.Gain30:
        this.addGold(30);
        break;
      case Chests.Gain40:
        this.addGold(40);
        break;
      case Chests.Gain50:
        this.addGold(50);
        break;
      case Chests.Gain100:
        this.addGold(100);
        break;
      case Chests.Double:
        this.addGold(this.gold);
        break;
      case Chests.Triple:
        this.addGold(this.gold * 2);
        break;
      case Chests.Lose25:
        this.subGoldPercent(25);
        break;
      case Chests.Lose50:
        this.subGoldPercent(50);
        break;
      case Chests.Steal10:
        if (!player) {
          throw new Error("player");
        }

        this.applySteal(player, 10);
        break;
      case Chests.Steal25:
        if (!player) {
          throw new Error("player");
        }

        this.applySteal(player, 25);
        break;

      default:
        break;
    }

    // Reset lại 3 hòm để chọn để tránh người dùng click nhiều lần
    this.chestsToChoose = [];
  }

  public async handleGameEvent(gameEvent: GameEvent) {
    const cafeGameEvent = gameEvent.payload;
    const player: Player = gameEvent.sourcePlayer || {
      id: "",
      avatar: "",
      username: "",
      socketId: "",
    };
    const cafeGameEventType: GoldQuestGameEvent = cafeGameEvent.type;

    switch (cafeGameEventType) {
      case GoldQuestGameEvent.TakeByPercent:
        this.onStealed(player, cafeGameEvent.gold);
        break;
    }
  }

  public decodeActivity(activity: any): string | undefined {
    const action = activity.action;
    const data = activity.data;

    switch (action) {
      case GoldQuestActivity.Steal:
        return ` đã lấy ${data.gold} vàng từ ${data.targetPlayer.username}`;
    }
  }
}
