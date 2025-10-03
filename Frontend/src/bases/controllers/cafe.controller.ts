import { randomFromArray } from "@/games/cafe-game/helpers/random";
import {
  Ability,
  Customer,
  Stock,
  OrderItem,
  Question,
  ShopItem,
  STOCKS,
  QUESTIONS,
  ABILITIES,
  ABILITY_ID,
  AVATARS_CUSTOMER,
} from "@/model/model";
import GameController from "./game.controller";
import { GameEvent, Player } from "@common/types/host.type";
import { GameEventType } from "@common/constants/host.constant";
const MAX_CUSTOMER_CAN_SERVE = 3; // sô khách hàng tối đa có thể phục vụ
const DEFAULT_REWARD_PRICE_TOAST = 2; // sô khách hàng tối đa có thể phục vụ
const INDEX_MAX_LEVEL = 5; // max level

export interface CafeControllerInterface {
  getBalance(): number;
  getStocks(): Stock[];
  getQuestion(): Question;
  answerQuestion(answerId: string): { correct: boolean; message: string };
  getShop(): ShopItem[];
  buyShopItem(shopItemId: string): { success: boolean; message: string };
  getNextCustomer(): Customer;
  serve(customerId: string): {
    servedItems: { stockId: string; quantity: number }[];
    servedAll: boolean;
  };
  getAbilities(): Ability[];
  buyAbilityItem(
    abilityId: number,
    playerId?: string
  ): { success: boolean; message: string };
}

enum CafeActivity {
  BuyShopItem = "buy-shop-item",
}

enum CafeGameEvent {
  PaycheckBonus = "paycheck-bonus",
  TrashTheFood = "trash-the-food",
  Taxes = "taxes",
  HealthInspection = "health-inspection",
}

export default class CafeController
  extends GameController
  implements CafeControllerInterface
{
  private stocks: Stock[] = [];
  private shopItems: ShopItem[] = [];
  private customers: Customer[] = [];
  private balance: number = 0;
  private questions: Question[] = [];
  private currentQuestion: Question | null = null;
  private abilities: Ability[] = [];
  private doubleRewardCount: number = 0; //  số khách còn lại được x2 tiền
  private randomQuestion: () => Question = this.createRandomPicker(
    this.questions
  );

  public onActivePayCheckBonus: (player: Player) => void = () => {};
  public onActiveTrashTheFood: (player: Player) => void = () => {};
  public onActiveTaxes: (player: Player) => void = () => {};
  public onActiveHealthInspection: (player: Player) => void = () => {};

  constructor(hostId: string) {
    super(hostId);
    // Init Stocks
    this.stocks = STOCKS;
    // Init ShopItems
    this.shopItems = this.stocks.map((s, idx) => ({
      id: "s" + (idx + 1),
      stockId: s.id,
      enabled: false,
    }));

    // init Questions
    this.questions = QUESTIONS;

    this.abilities = ABILITIES;
  }

  public getSaveData() {
    return {
      stocks: this.stocks.map((s) => ({
        id: s.id,
        enabled: s.enabled,
        currentIndexLevel: s.currentIndexLevel,
      })),
      customers: this.customers,
      balance: this.balance,
      // questions: this.questions,
      currentQuestion: this.currentQuestion,
      abilities: this.abilities.map((a) => ({
        id: a.id,
        enabled: a.enabled,
        isActive: a.isActive,
        purchased: a.purchased,
      })),
      doubleRewardCount: this.doubleRewardCount,
      totalCorrectAnswers: this.totalCorrectAnswers,
      totalQuestions: this.totalQuestions,
    };
  }

  public async initData() {
    const gameData = await this.loadSavedGame();
    this.loadData(gameData);
    const s1Stock = this.stocks.find((s: any) => s.id === "s1");

    if (s1Stock && !s1Stock.enabled && s1Stock.currentIndexLevel === 0) {
      this.buyShopItem("s1");
    }

    this.randomQuestion = this.createRandomPicker(this.questions);
  }

  public loadData(gameData: any) {
    Object.assign(this, gameData);

    this.abilities = this.abilities.map((a, i) => {
      return {
        ...ABILITIES[i],
        ...a,
      };
    });

    this.stocks = this.stocks.map((a, i) => {
      return {
        ...STOCKS[i],
        ...a,
      };
    });

    this.customers = this.customers.filter((c) => {
      return c.orders.length > 0;
    }); // lọc lại những khách hàng đã order
  }

  // Lấy số tiền
  getBalance(): number {
    return this.balance;
  }

  // Lấy danh sách món ăn
  getStocks(): Stock[] {
    return this.stocks.map((s) => {
      return {
        ...s,
        priceSell: s.sellPrices[s.currentIndexLevel],
        priceReWard: s.rewardPrices[s.currentIndexLevel],
      };
    });
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

  getQuestion(): Question {
    this.currentQuestion = this.randomQuestion();
    //shuffle answers
    this.currentQuestion.answers.sort(() => Math.random() - 0.5);
    this.totalQuestions += 1;

    this.saveGame();

    return this.currentQuestion;
  }

  answerQuestion(answerId: string): { correct: boolean; message: string } {
    if (!this.currentQuestion) {
      return { correct: false, message: "No question has been asked yet" };
    }

    const isCorrect = this.currentQuestion.correctAnswerId === answerId;
    if (!isCorrect) {
      return { correct: false, message: "Wrong answer." };
    }

    // đúng thì +1 số lượng cho tất cả món ăn enable
    this.stocks.forEach((s) => {
      if (s.enabled) s.quantity += 1;
    });

    this.totalCorrectAnswers += 1;
    this.saveGame();
    return { correct: true, message: "OK" };
  }

  getShop(): ShopItem[] {
    return this.shopItems.map((item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const stock: Stock = this.stocks.find((s) => s.id === item.stockId);

      const priceToSell = stock.enabled
        ? stock.sellPrices[stock.currentIndexLevel + 1]
        : stock.sellPrices[0]; // giá cần có dể mua được

      const isMaxLevel = stock.currentIndexLevel == INDEX_MAX_LEVEL;
      return {
        ...item,
        enabled: stock && !isMaxLevel ? this.balance >= priceToSell : false,
      };
    });
  }

  // Mua trong Shop
  buyShopItem(shopItemId: string): { success: boolean; message: string } {
    const shopItem = this.shopItems.find((s) => s.id === shopItemId);
    if (!shopItem) return { success: false, message: "Item not found" };

    const stockIndex = this.stocks.findIndex((s) => s.id === shopItem.stockId);
    if (stockIndex === -1)
      return { success: false, message: "Food stock not found" };

    const stock = this.stocks[stockIndex];

    const priceToSell = stock.enabled
      ? stock.sellPrices[stock.currentIndexLevel + 1]
      : stock.sellPrices[0]; // giá cần có dể mua được

    if (this.balance < priceToSell) {
      return { success: false, message: "Not enough money" };
    }

    this.updateBalance(this.balance - priceToSell);

    let levelUp = stock.enabled ? stock.currentIndexLevel + 1 : 0;

    if (levelUp > INDEX_MAX_LEVEL) {
      levelUp = INDEX_MAX_LEVEL;
    }

    this.stocks[stockIndex] = {
      ...stock,
      enabled: true,
      currentIndexLevel: levelUp,
    };

    this.saveActivity({
      action: CafeActivity.BuyShopItem,
      data: {
        level: levelUp + 1,
        stockId: stock.id,
      },
    });
    this.saveGame();

    return {
      success: true,
      message: `${stock.name} purchased! `,
    };
  }

  getNextCustomer(slot = null): Customer {
    // limit 3 khach hang order
    if (this.customers.length == MAX_CUSTOMER_CAN_SERVE) {
      throw new Error("Maximum customer serve");
    }

    const usedSlots = this.customers.map((c) => c.position);
    const allSlots = Array.from(
      { length: MAX_CUSTOMER_CAN_SERVE },
      (_, i) => i + 1
    );

    if (!slot) {
      slot = randomFromArray(allSlots.filter((s) => !usedSlots.includes(s)));
    }

    const enabledStocks = this.stocks.filter((s) => s.enabled);

    const orderCount = Math.min(
      Math.floor(Math.random() * 3) + 1, // random 1 -> 3
      enabledStocks.length
    );

    const orders: OrderItem[] = [];

    const shuffled = [...enabledStocks].sort(() => 0.5 - Math.random());
    for (let i = 0; i < orderCount; i++) {
      const food = shuffled[i];
      orders.push({ stockId: food.id, quantity: randomFromArray([1, 2, 3]) });
    }
    const cIndex = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random() + "-customer";

    const avatarId = this.genAvatarId();

    const customerNew = {
      id: cIndex.toString(),
      name: "Customer " + cIndex,
      orders,
      originalOrders: JSON.parse(JSON.stringify(orders)),
      avatar: AVATARS_CUSTOMER[avatarId],
      avatarId: avatarId,
      position: parseInt(slot as any),
      firstLoad: false,
    };
    this.customers.push(customerNew);
    this.saveGame();

    return customerNew;
  }

  setFirstLoad(id: string | undefined, firstLoad: boolean): void {
    if (!id) return;
    const customer = this.customers.find((c) => c.id === id);
    if (customer) {
      customer.firstLoad = firstLoad;
    }
  }

  getCustomers(): Customer[] {
    while (this.customers.length < MAX_CUSTOMER_CAN_SERVE) {
      this.getNextCustomer();
    }

    return this.customers;
  }

  serve(customerId: string): {
    servedItems: { stockId: string; quantity: number }[]; // Danh sach cac mon an da phuc vu
    servedAll: boolean; // Đã phục vụ hoàn thành khach hay chưa
    totalEarned?: number;
  } {
    const customerIndex = this.customers.findIndex((c) => c.id === customerId);

    if (customerIndex === -1) return { servedItems: [], servedAll: false };

    const customer = this.customers[customerIndex];

    let isServedAll = true; // trạng thái phục vụ được tất cả món án + số lượng mà khách order

    const servedItems: { stockId: string; quantity: number }[] = []; // danh sách món ăn + số lượng đã phục vụ

    customer.orders.forEach((order) => {
      const stock = this.stocks.find((s) => s.id === order.stockId);

      if (!stock || !stock.enabled || stock.quantity <= 0) {
        isServedAll = false;
        return;
      }

      const serveQuantity = Math.min(stock.quantity, order.quantity); // Lấy số lương tối đa stock đang có để phục vụ order

      stock.quantity -= serveQuantity; // trừ stock đang có
      order.quantity -= serveQuantity; // trừ số lượng trong order

      // Lưu lại số lượng món ăn đã phục vụ
      if (serveQuantity > 0) {
        servedItems.push({ stockId: stock.id, quantity: serveQuantity });
      }

      if (order.quantity > 0) isServedAll = false; // trong order vẫn có món ăn còn số lượng cần mua -> đánh dấu chua phuc vu xong
    });

    // Xóa những món đã phục vụ của khách hàng
    customer.orders = customer.orders.filter((order) => order.quantity > 0);

    if (!isServedAll) {
      if (servedItems.length > 0) {
        this.saveGame();
      }

      return {
        servedItems,
        servedAll: false,
      };
    }

    // Nếu đủ phục vụ toàn bộ order của khách → cộng tiền
    let totalEarned = 0;

    customer.originalOrders.forEach((item) => {
      const stock = this.stocks.find((s) => s.id === item.stockId)!;

      let priceToReward = stock.rewardPrices[stock.currentIndexLevel]; // số tiền nhận đc khi phuc vụ xong 1 món

      if (this.doubleRewardCount > 0) priceToReward *= 2; // dùng ability x2 tiền

      totalEarned += priceToReward * item.quantity;
    });

    this.updateBalance(this.balance + totalEarned);

    // Giảm số khách còn x2
    if (this.doubleRewardCount > 0) this.doubleRewardCount -= 1;

    // Xóa khách đã phục vụ xong
    // Sẽ xóa sau
    // this.customers.splice(customerIndex, 1);

    return {
      servedItems,
      totalEarned,
      servedAll: true,
    };
  }

  getAbilities(): Ability[] {
    return this.abilities.map((ability) => ({
      ...ability,
      enabled: !ability.purchased && this.balance >= ability.price,
    }));
  }

  buyAbilityItem(
    abilityId: ABILITY_ID,
    playerId?: string
  ): { success: boolean; message: string } {
    const ability = this.abilities.find((a) => a.id == abilityId);
    if (!ability) return { success: false, message: "Ability not found" };
    if (ability.purchased)
      return { success: false, message: "Already purchased" };
    if (this.balance < ability.price)
      return { success: false, message: "Not enough money" };

    // if (REQUIRE_PLAYER_ABILITES.includes(abilityId) && !playerId) {
    //   return { success: false, message: "Player should be provided" };
    // }

    // Xử lý logic theo từng loại item
    switch (ability.id) {
      case ABILITY_ID.PAYCHECK_BONUS:
        this.applyPayCheckBounus(playerId!);
        break;

      case ABILITY_ID.SUPPLY_CRATE:
        this.stocks.forEach((stock) => {
          if (stock.enabled) {
            stock.quantity += 7;
          }
        });
        break;

      case ABILITY_ID.TAXES:
        this.applyTaxes(playerId!);
        break;

      case ABILITY_ID.TRASH_THE_FOOD:
        this.applyTrashTheFood(playerId!);
        break;

      case ABILITY_ID.HAPPY_CUSTOMER:
        this.doubleRewardCount = 5; // 5 khách tiếp theo sẽ x2
        break;

      case ABILITY_ID.HEALTH_INSPECTION:
        this.applyHealthInspection(playerId!);
        break;

      case ABILITY_ID.RUN_IT_BACK:
        this.abilities.forEach((a) => {
          a.purchased = false;
        });
        break;
    }

    // Trừ tiền
    this.updateBalance(this.balance - ability.price);
    ability.purchased = true;

    this.saveGame();

    return { success: true, message: `${ability.name} purchased!` };
  }

  // Abilities Func
  async applyPayCheckBounus(playerId: string) {
    await this.emitGameEvent({
      type: GameEventType.Players,
      targetPlayerIds: [playerId],
      payload: {
        type: CafeGameEvent.PaycheckBonus,
      },
    });
  }

  async applyTrashTheFood(playerId: string) {
    await this.emitGameEvent({
      type: GameEventType.Players,
      targetPlayerIds: [playerId],
      payload: {
        type: CafeGameEvent.TrashTheFood,
      },
    });
  }

  async applyTaxes(playerId: string) {
    await this.emitGameEvent({
      type: GameEventType.Players,
      targetPlayerIds: [playerId],
      payload: {
        type: CafeGameEvent.Taxes,
      },
    });
  }

  async applyHealthInspection(playerId: string) {
    await this.emitGameEvent({
      type: GameEventType.Players,
      targetPlayerIds: [playerId],
      payload: {
        type: CafeGameEvent.HealthInspection,
      },
    });
  }

  async onPayCheckBonus(player: Player) {
    await this.updateBalance(this.getBalance() * 1.25);
    await this.saveGame();
    this.onActivePayCheckBonus(player);
  }
  async onTrashTheFood(player: Player) {
    const numTrash = 3;

    if (!this.stocks.length) return;

    this.stocks.forEach((s) => {
      if (s.enabled) {
        s.quantity = Math.max(0, s.quantity - numTrash);
      }
    });
    await this.saveGame();

    this.onActiveTrashTheFood(player);
  }
  async onTaxes(player: Player) {
    await this.updateBalance(this.getBalance() * 0.75);
    await this.saveGame();
    this.onActiveTaxes(player);
  }
  async onHealthInspection(player: Player) {
    //
    this.onActiveHealthInspection(player);
  }
  // End Abilities Func

  genAvatarId(): any {
    const avatarID = Math.floor(Math.random() * AVATARS_CUSTOMER.length);
    const avatarExist = this.customers.find((c) => c.avatarId == avatarID);
    return avatarExist ? this.genAvatarId() : avatarID;
  }

  removeCustomerByPosition(position: number) {
    const customerIndex = this.customers.findIndex(
      (c) => c.position == position
    );
    if (customerIndex !== -1) {
      this.customers.splice(customerIndex, 1);
    }
    this.saveGame();
  }

  async updateBalance(balance: number) {
    this.balance = Math.round(balance);

    await this.onScoreUpdate(this.balance);
  }

  public static decodeActivity(activity: any) {
    const action = activity.action;
    const data = activity.data;

    switch (action) {
      case CafeActivity.BuyShopItem:
        const foodName = STOCKS.find((s) => s.id === data.stockId)?.name;
        return `has updated ${foodName} to level ${data.level}`;
    }
  }

  public async handleGameEvent(gameEvent: GameEvent) {
    const cafeGameEvent = gameEvent.payload;
    const player: Player = gameEvent.sourcePlayer || {
      id: "",
      avatar: "",
      username: "",
      socketId: "",
    };
    const cafeGameEventType: CafeGameEvent = cafeGameEvent.type;

    switch (cafeGameEventType) {
      case CafeGameEvent.PaycheckBonus:
        await this.onPayCheckBonus(player);
        break;
      case CafeGameEvent.TrashTheFood:
        await this.onTrashTheFood(player);
        break;
      case CafeGameEvent.Taxes:
        await this.onTaxes(player);
        break;
      case CafeGameEvent.HealthInspection:
        await this.onHealthInspection(player);
        break;
    }
  }
}
