import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import SettingAudioReactIcon from "@/games/components/setting-audio-react/setting-audio-react-icon";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import ButtonCafeGame from "@/games/cafe-game-react/components/button-cafe-game/button-cafe-game";
import AbilitiesItem from "./components/abilities-item";
import { REQUIRE_PLAYER_ABILITES } from "@/model/model";
import { useLayoutEffect } from "react";

export default function AbilitiesContainer() {
  const {
    setIsChoosingAbilityTarget,
    cafeAbilitiesItems,
    loadCafeBalance,
    loadCafeAbilities,
    loadCafeStocks,
    cafeBalance,
    setToggleVisitShop,
    setToggleAbilitiShop,
    setToggleLeaderBoard,
  } = CafeGameStore();

  useLayoutEffect(() => {
    loadCafeAbilities();
  }, []);

  const doClickBuyItem = (id = 0) => {
    const cafeController = getCafeControllerInstance();
    if (REQUIRE_PLAYER_ABILITES.includes(id)) {
      setIsChoosingAbilityTarget(id);
    } else {
      cafeController.buyAbilityItem(id);
      loadCafeAbilities();
    }

    loadCafeStocks();
    loadCafeBalance();
  };

  const doClickBackShop = () => {
    setToggleVisitShop(true);
    setToggleAbilitiShop(false);
  };

  const doClickExitShop = () => {
    setToggleAbilitiShop(false);
    setToggleVisitShop(false);
  };
  return (
    <div className="cafe-game__abilities">
      <div className="cafe-game__abilities-header">
        <div className="cafe-game__abilities-header-setting">
          <img
            src="/images/cafe-game/leader-board.svg"
            alt=""
            onClick={() => setToggleLeaderBoard(true)}
          />
          <SettingAudioReactIcon />
        </div>
        <div className="cafe-game__abilities-header-curtain">
          <div className="cafe-game__abilities-header-curtain-upgrades">
            <div>Abilities</div>
          </div>
          <div className="cafe-game__abilities-header-curtain-money">
            <div>{`$${cafeBalance}`}</div>
          </div>
        </div>
      </div>
      <div className="cafe-game__abilities-body">
        <div className="cafe-game__abilities-cover-items">
          {cafeAbilitiesItems.map((item, i) => {
            const enabled = item.enabled;
            const price = item.price;
            return (
              <AbilitiesItem
                key={i}
                {...item}
                priceSell={price}
                enabled={enabled}
                doClickBuyItem={doClickBuyItem}
              />
            );
          })}
        </div>
      </div>
      <div className="cafe-game__abilities-cover-btn">
        <ButtonCafeGame doClickBtn={doClickBackShop} text="Upgrades" />
        <ButtonCafeGame doClickBtn={doClickExitShop} text="Exit Shop" />
      </div>
    </div>
  );
}
