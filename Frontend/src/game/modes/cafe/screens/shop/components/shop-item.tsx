import { formatScore } from "@/game/common/utils/utils";

export default function ShopItem({
  name = "Toast",
  priceSell = 0,
  image = "",
  enabled = false,
  id = 0,
  currentIndexLevel = 0,
  available = false,
  rewardPrices = [],
  doClickBuyItem = (id: number) => {},
}) {
  const plateLevelArr = [
    "/images/cafe-game/plate-active.svg",
    "/images/cafe-game/plate-level-2.svg",
    "/images/cafe-game/plate-level-3.svg",
    "/images/cafe-game/plate-level-4.svg",
    "/images/cafe-game/plate-level-5.svg",
    "/images/cafe-game/plate-level-5.svg",
  ];

  const defaultActive = {
    onPointerUp: () => doClickBuyItem(id),
    disabled: true,
  };
  const activeObj = enabled ? defaultActive : {};

  const currentReward = available ? rewardPrices[currentIndexLevel] : 0;
  const nextReward = available
    ? rewardPrices[currentIndexLevel + 1]
    : rewardPrices[currentIndexLevel];

  const description = `$${formatScore(currentReward)} ${formatScore(nextReward) ? "→" : ""} ${
    "$" + formatScore(nextReward)
  }`;
  const max = currentIndexLevel === rewardPrices.length - 1;

  return (
    <button
      className={`cafe-game__shop-item ${
        enabled && "cafe-game__shop-item-active"
      }`}
      {...activeObj}
    >
      <div className="cafe-game__shop-item-content">
        <div>{name}</div>
        <div>{description}</div>
        <div>{max ? "MAX" : `$${formatScore(priceSell)}`}</div>
      </div>
      <div className="cafe-game__shop-item-img">
        <img src={`${plateLevelArr[currentIndexLevel]}`} alt="" />
        <div>
          <img src={`/images/cafe-game/${image}.svg`} alt="" />
        </div>
      </div>
    </button>
  );
}
