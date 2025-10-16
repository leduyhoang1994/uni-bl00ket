import CafeGameStore from "@/game/modes/cafe/store";
import ButtonCafeGame from "@/game/modes/cafe/components/button-cafe-game/button-cafe-game";
import QuizStore from "@/game/common/components/quiz/store";
import Plate from "./plate";

export default function TableContainer() {
  const { setToggleQuizContainer, loadNewQuestion } = QuizStore();
  const { setToggleVisitShop, cafeStocks, loadCafeShopItems } = CafeGameStore();

  const doClickRestockFood = () => {
    loadNewQuestion();
    setToggleQuizContainer(true);
  };

  const doClickVisitShop = () => {
    loadCafeShopItems();
    setToggleVisitShop(true);
  };

  return (
    <div className="cafe-game__table-container">
      <div className="cafe-game__table-container-plate">
        {cafeStocks.map((_, i) => {
          let plateIndex;
          if (i % 2 === 0) {
            plateIndex = i / 2;
          } else {
            plateIndex = (i - 1) / 2 + 5;
          }
          const plateData = cafeStocks[plateIndex];
          const plateLevel = plateData.currentIndexLevel;
          const enabled = plateData.enabled;
          const quantity = plateData.quantity;
          return (
            <div key={i}>
              <Plate
                enabled={enabled}
                plateLevel={plateLevel}
                quantity={quantity}
                zIndex={cafeStocks.length - i}
                plateData={plateData}
              />
            </div>
          );
        })}
      </div>
      <div className="cafe-game__table-container-cover-btn">
        <ButtonCafeGame doClickBtn={doClickRestockFood} />
        <ButtonCafeGame doClickBtn={doClickVisitShop} text="Cửa hàng" />
      </div>
    </div>
  )
}