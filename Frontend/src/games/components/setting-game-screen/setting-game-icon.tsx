import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import SettingGameStore from "@/stores/setting-game-store/setting-game-store";
import { LayoutContainer } from "@pixi/layout/components"
import { useExtend } from "@pixi/react"
import { Assets, Texture } from "pixi.js";

export default function SettingGameIcon() {
  useExtend({ LayoutContainer });
  const { toggleSettingGame, setToggleSettingGame } = SettingGameStore();
  const { tagMoneyWidth } = CafeGameStore();
  const settingGameTexture = Assets.get("setting-game");

  const doClickSetting = () => {
    console.log('doClickSetting');

    setToggleSettingGame(!toggleSettingGame);
  }

  return (
    <>
      {settingGameTexture !== Texture.EMPTY && <pixiSprite
        texture={settingGameTexture}
        x={tagMoneyWidth + 60}
        y={0}
        width={45}
        height={45}
        cursor="pointer"
        interactive
        onPointerTap={doClickSetting}
      />}
    </>
  )
}