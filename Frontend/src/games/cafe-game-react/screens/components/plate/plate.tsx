import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import RenderIf from "@/utils/condition-render";
import { useEffect, useRef } from "react";

export default function Plate({
  enabled = false,
  quantity = 0,
  plateData = {} as any,
  plateLevel = 0,
  zIndex = 0,
}) {
  const { serveAnimates, removeServeAnimatesByIndex } = CafeGameStore();
  const foodRef = useRef<HTMLImageElement>(document.createElement("img"));
  const plateLevelArr = [
    "/images/cafe-game/plate-active.svg",
    "/images/cafe-game/plate-level-2.svg",
    "/images/cafe-game/plate-level-3.svg",
    "/images/cafe-game/plate-level-4.svg",
    "/images/cafe-game/plate-level-5.svg",
    "/images/cafe-game/plate-level-5.svg",
  ];
  const text = `${quantity}`;
  const imageSlug = plateData?.image;
  const foodImagePath = `/images/cafe-game/${imageSlug}.svg`;

  useEffect(() => {
    const foundStock = serveAnimates.find((a) => a.stockId == plateData.id);

    if (!foundStock) {
      return;
    }

    const foundStockIdx = serveAnimates.findIndex(
      (a) => a.stockId == plateData.id
    );
    removeServeAnimatesByIndex(foundStockIdx);
    const serveAnimContainer = document.querySelector(
      ".cafe-game__serve-animations-container"
    );

    for (let i = 0; i < foundStock.quantity; i++) {
      setTimeout(() => {
        const imageElem = document.createElement("img");
        const rect = foodRef.current.getBoundingClientRect();
        imageElem.src = foodImagePath;
        imageElem.className = "cafe-game__serve-animations-food";
        imageElem.style.width = rect.width + "px";
        imageElem.style.height = "auto";
        imageElem.style.left = `${rect.x}px`;
        imageElem.style.top = `${rect.y}px`;
        imageElem.style.transition = "all 0.5s ease-in-out";
        serveAnimContainer?.appendChild(imageElem);

        setTimeout(() => {
          imageElem.style.left = `${foundStock.position.x + foundStock.position.width - rect.width}px`;
          imageElem.style.top = `${foundStock.position.y + foundStock.position.height - rect.height}px`;
          imageElem.style.opacity = "0";
        }, 100);
      }, i * 100);
    }
  }, [serveAnimates.length]);

  return (
    <div className="cafe-game__plate" style={{ zIndex: zIndex }}>
      <img
        className={`${
          !enabled ? "cafe-game__plate-non-active" : "cafe-game__plate-active"
        }`}
        src={`${plateLevelArr[plateLevel]}`}
        alt="plate"
        draggable="false"
      />

      <RenderIf condition={enabled}>
        <img
          className="cafe-game__plate-food"
          src={foodImagePath}
          alt=""
          ref={foodRef}
        />
        <div className="cafe-game__plate-food-number">{text}</div>
      </RenderIf>
    </div>
  );
}
