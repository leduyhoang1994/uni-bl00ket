import RenderIf from "@/utils/condition-render";

export default function Plate({
  enabled = false,
  quantity = 0,
  plateData = {} as any,
  plateLevel = 0,
  zIndex = 0
}) {

  const plateLevelArr = [
    "/images/cafe-game/plate-active.svg",
    "/images/cafe-game/plate-level-2.svg",
    "/images/cafe-game/plate-level-3.svg",
    "/images/cafe-game/plate-level-4.svg",
    "/images/cafe-game/plate-level-5.svg",
    "/images/cafe-game/plate-level-5.svg",
  ]
  const text = `${quantity}`;

  return (
    <div className="cafe-game__plate" style={{ zIndex: zIndex }}>
      <img
        className={`${!enabled ? 'cafe-game__plate-non-active' : 'cafe-game__plate-active'}`}
        src={`${plateLevelArr[plateLevel]}`}
        alt="plate"
        draggable="false" />
      <RenderIf condition={true}>
        <div className="cafe-game__plate-food-number">{text}</div>
      </RenderIf>
    </div>
  )
}