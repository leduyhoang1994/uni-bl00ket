import SettingAudioReactIcon from "@/games/components/setting-audio-react/setting-audio-react-icon";
import ShopItem from "./components/shop-item";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import ButtonCafeGame from "@/games/cafe-game-react/components/button-cafe-game/button-cafe-game";
import { useLayoutEffect } from "react";

export default function ShopContainer() {
  const {
    cafeShopItems,
    cafeStocks,
    loadCafeBalance,
    loadCafeShopItems,
    loadCafeStocks,
    cafeBalance,
    setToggleVisitShop,
    setToggleAbilitiShop,
  } = CafeGameStore();

  useLayoutEffect(() => {
    loadCafeShopItems();
  }, []);

  const doClickBuyItem = (id: number | string) => {
    const cafeController = getCafeControllerInstance();
    cafeController.buyShopItem(String(id));
    loadCafeShopItems();
    loadCafeStocks();
    loadCafeBalance();
  };

  const doClickGoAbilities = () => {
    setToggleAbilitiShop(true);
    setToggleVisitShop(false);
  };

  const doClickExitShop = () => {
    setToggleAbilitiShop(false);
    setToggleVisitShop(false);
  };

  return (
    <div className="cafe-game__shop">
      <div className="cafe-game__shop-header">
        <div className="cafe-game__shop-header-setting">
          <img src="/images/cafe-game/leader-board.svg" alt="" />
          <SettingAudioReactIcon />
        </div>
        <div className="cafe-game__shop-header-curtain">
          <div className="cafe-game__shop-header-curtain-upgrades">
            <div>Upgrades</div>
          </div>
          <div className="cafe-game__shop-header-curtain-money">
            <div>{`$${cafeBalance}`}</div>
          </div>
        </div>
      </div>
      <div className="cafe-game__shop-body">
        <div className="cafe-game__shop-cover-items">
          {cafeStocks.map((dataStock, i) => {
            const enabled = cafeShopItems[i].enabled;
            const max =
              dataStock.currentIndexLevel === dataStock.rewardPrices.length - 1;

            const price = dataStock.enabled
              ? dataStock.sellPrices[dataStock.currentIndexLevel + 1]
              : dataStock.sellPrices[dataStock.currentIndexLevel];

            return (
              <ShopItem
                key={i}
                {...dataStock}
                priceSell={max ? "MAX" : price}
                available={dataStock.enabled}
                enabled={enabled}
                doClickBuyItem={doClickBuyItem}
              />
            );
          })}
        </div>
      </div>
      <div className="cafe-game__shop-cover-btn">
        <ButtonCafeGame doClickBtn={doClickGoAbilities} text="Abilities" />
        <ButtonCafeGame doClickBtn={doClickExitShop} text="Exit Shop" />
      </div>
    </div>
  );
}
