import '@pixi/layout/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import HeaderUpgradeScreen from './components/header-upgrade-screen';
import { useExtend } from '@pixi/react';
import BodyUpgradeScreen from './components/body-upgrade-screen';
import ButtonScreen from '@/games/cafe-game/components/button-screen/button-screen';
import CafeGameStore from '@/games/stores/cafe-game-store/cafe-game-store';
import { DESIGN_VIEWPORT } from '@/games/application';

export default function UpgradesScreen() {
  useExtend({ LayoutContainer });
  const { setToggleAbilitiShop, setToggleVisitShop, toggleAbilitiShop, loadCafeShopItems, loadCafeAbilities } = CafeGameStore();
  const appWidth = DESIGN_VIEWPORT.width;
  const appHeight = DESIGN_VIEWPORT.height;
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
      <layoutContainer
        label='Upgrade screen'
        layout={{
          width: appWidth,
          height: appHeight,
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
