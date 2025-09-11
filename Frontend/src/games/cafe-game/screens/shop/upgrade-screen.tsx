import '@pixi/layout/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import HeaderUpgradeScreen from './components/header-upgrade-screen';
import { useApplication, useExtend } from '@pixi/react';
import BodyUpgradeScreen from './components/body-upgrade-screen';
import ButtonScreen from '@/games/cafe-game/components/button-screen/button-screen';
import CafeGameStore from '@/games/stores/cafe-game-store/cafe-game-store';

export default function UpgradesScreen() {
  useExtend({ LayoutContainer });
  const { app } = useApplication();
  const { setToggleAbilitiShop, setToggleVisitShop, toggleAbilitiShop, loadCafeShopItems, loadCafeAbilities } = CafeGameStore();
  const appHeight = app.screen.height;
  const appWidth = app.screen.width;
  const buttonContainerWidth = appWidth * 0.95;
  const buttonContainerHeight = appHeight / 9;
  const buttonWidth = appWidth / 4;

  const doClickToggleAbilitesAndShop = () => {
    setToggleAbilitiShop(!toggleAbilitiShop);
    loadCafeAbilities();
    loadCafeShopItems();
  }

  const doClickExitShop = () => {
    setToggleAbilitiShop(false);
    setToggleVisitShop(false);
  }

  return (
    <>
      <layoutContainer layout={{
        width: app.screen.width,
        height: app.screen.height,
        flexDirection: "column",
        backgroundColor: "white"
      }}>
        <HeaderUpgradeScreen />
        <BodyUpgradeScreen />
        <pixiContainer
          label="Button Table cafe-game"
          width={buttonContainerWidth}
          height={buttonContainerHeight}
          x={(appWidth - buttonContainerWidth) / 2}
          y={appHeight - buttonContainerHeight - 10}
        >
          <ButtonScreen
            btnWidth={buttonWidth}
            btnText={!toggleAbilitiShop ? "Abilities" : "Upgrades"}
            doClickBtn={doClickToggleAbilitesAndShop}
          />
          <ButtonScreen
            btnWidth={buttonWidth}
            btnText="Exit Shop"
            doClickBtn={doClickExitShop}
            btnContainerX={buttonContainerWidth - buttonWidth}
          />
        </pixiContainer>
      </layoutContainer>
    </>
  )
}
