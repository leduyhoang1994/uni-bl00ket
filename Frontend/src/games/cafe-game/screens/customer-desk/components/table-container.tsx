"use client";

import { useExtend } from "@pixi/react";
import { Assets, Container, Sprite, Texture, TilingSprite } from "pixi.js";
import ButtonScreen from "@/games/cafe-game/components/button-screen/button-screen";
import QuizStore from "@/stores/quiz-store/quiz-store";
import { useRef } from "react";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import PlateComponent from "./plate-component";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function TableContainer() {
  useExtend({ Sprite, TilingSprite });
  const { setToggleQuizContainer, loadNewQuestion } = QuizStore();
  const { setToggleVisitShop, cafeStocks, loadCafeShopItems } = CafeGameStore();
  const plateContainer = useRef<Container>(new Container());

  const appWidth = DESIGN_VIEWPORT.width;
  const appHeight = DESIGN_VIEWPORT.height;
  const currentTableHeight = appHeight / 2;
  const textureTable = Assets.get("back-ground-table");

  const itemsContainerWidth = appWidth * 0.92;

  const buttonContainerWidth = appWidth / 1.8;
  const buttonContainerHeight = appHeight / 9;
  const buttonWidth = buttonContainerWidth / 2.5;

  const doClickRestockFood = () => {
    loadNewQuestion();
    setToggleQuizContainer(true);
  };

  const doClickVisitShop = () => {
    loadCafeShopItems();
    setToggleVisitShop(true);
  };

  return (
    <pixiContainer
      label="Table cafe-game"
      y={currentTableHeight}
      width={appWidth}
      height={currentTableHeight}
    >
      {textureTable !== Texture.EMPTY && (
        <pixiSprite
          texture={textureTable}
          x={0}
          y={0}
          width={appWidth}
          height={currentTableHeight}
        />
      )}
      <pixiContainer
        label="Plate Table cafe-game"
        ref={plateContainer}
        x={150}
        y={15}
      >
        {cafeStocks.map((_, i) => {
          const plateWidth = itemsContainerWidth / 9;
          const plateHeight = plateWidth;
          const x = i * plateWidth * 0.8;
          const y = i % 2 === 0 ? 0 : plateHeight * 0.8;
          let plateIndex;
          if (i % 2 === 0) {
            plateIndex = i / 2;
          } else {
            plateIndex = (i - 1) / 2 + 5;
          }
          const plateData = cafeStocks[plateIndex];
          const plateLevel = plateData.currentIndexLevel;
          const image = Assets.get(plateData.image);
          const enabled = plateData.enabled;
          const quantity = plateData.quantity;
          return (
            <PlateComponent
              enabled={enabled}
              plateLevel={plateLevel}
              quantity={quantity}
              i={plateIndex}
              key={i}
              plateWidth={plateWidth}
              plateHeight={plateHeight}
              x={x}
              y={y}
              textureItem={image}
              plateData={plateData}
              globPos={{
                x: plateContainer.current.getGlobalPosition().x + x,
                y: plateContainer.current.getGlobalPosition().y + y,
              }}
            />
          );
        })}
      </pixiContainer>
      <pixiContainer
        label="Button Table cafe-game"
        width={buttonContainerWidth}
        height={buttonContainerHeight}
        x={(appWidth - buttonContainerWidth) / 2}
        y={currentTableHeight - buttonContainerHeight - 10}
      >
        <ButtonScreen
          btnWidth={buttonWidth}
          btnText="Restock Food"
          doClickBtn={doClickRestockFood}
        />
        <ButtonScreen
          btnWidth={buttonWidth}
          btnContainerX={buttonContainerWidth - buttonWidth}
          doClickBtn={doClickVisitShop}
        />
      </pixiContainer>
    </pixiContainer>
  );
}
