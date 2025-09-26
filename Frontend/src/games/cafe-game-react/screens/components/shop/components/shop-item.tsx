export default function ShopItem({
  name = "Toast",
  priceSell = 0,
  image = "",
  enabled = false,
  id = 0,
  currentIndexLevel = 0,
  doClickBuyItem = (id: number) => { }
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

  return (
    <button className={`cafe-game__shop-item ${enabled && 'cafe-game__shop-item-active'}`} {...activeObj}>
      <div className="cafe-game__shop-item-content">
        <div>{name}</div>
        <div style={{ height: "15px" }}></div>
        <div>{`${String(priceSell) == 'MAX' ? priceSell : `$${priceSell}`}`}</div>
      </div>
      <div className="cafe-game__shop-item-img">
        <img src={`${plateLevelArr[currentIndexLevel]}`} alt="" />
        <div>
          <img src={`/images/cafe-game/${image}.svg`} alt="" />
        </div>
      </div>
    </button>
  )
}