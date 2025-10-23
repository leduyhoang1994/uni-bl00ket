import { formatScore } from "@/game/common/utils/utils";

export default function AbilitiesItem({
  name = "Paycheck Bonus",
  description = "",
  priceSell = 0,
  image = "",
  enabled = false,
  id = 0,
  doClickBuyItem = (id: number) => { }
}) {

  const defaultActive = {
    onPointerUp: () => doClickBuyItem(id),
    disabled: true,
  };
  const activeObj = enabled ? defaultActive : {};

  return (
    <button className={`cafe-game__abilities-item ${enabled && 'cafe-game__abilities-item-active'}`} {...activeObj}>
      <div className="cafe-game__abilities-item-content">
        <div>{name}</div>
        <div>{description}</div>
        <div>{`$${formatScore(priceSell)}`}</div>
      </div>
      <div className="cafe-game__abilities-item-img">
        <div>
          <img src={`/images/cafe-game/${image}.svg`} alt="" />
        </div>
      </div>
    </button>
  )
}