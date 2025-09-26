import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import RenderIf from "@/utils/condition-render";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export default function Customer({ position }: { position: number }) {
  const {
    customers,
    cafeStocks,
    loadCustomers,
    loadCafeStocks,
    loadCafeBalance,
    pushServeAnimates,
  } = CafeGameStore();
  const customer = customers.find((c) => c.position === position);
  const [earned, setEarned] = useState(0);
  const foodCount = customer?.orders.length || 2;
  const [served, setServed] = useState(false);
  const custAvatarRef = useRef<HTMLImageElement>(document.createElement("img"));

  const orders = customer?.orders || [];

  const serve = useCallback(() => {
    // setServed(true);
    if (!customer) {
      return;
    }
    const gameController = getCafeControllerInstance();
    const serveResult = gameController.serve(customer?.id);

    loadCafeStocks();
    pushServeAnimates(
      serveResult.servedItems.map((item) => {
        return {
          ...item,
          position:
            custAvatarRef.current.getBoundingClientRect() as unknown as {
              x: number;
              y: number;
            },
        };
      })
    );

    if (serveResult.servedAll) {
      setEarned(serveResult.totalEarned || 0);
      setServed(true);
      loadCafeBalance();

      setTimeout(() => {
        const gameController = getCafeControllerInstance();
        gameController.removeCustomerByPosition(position);
        loadCustomers();
        setServed(false);
      }, 2000);
    }
  }, [customers.find((c) => c.position == position)?.id]);

  // useLayoutEffect(() => {
  //   setTimeout(() => {
  //     setServed(true);
  //     setEarned(100);
  //   }, 1500);
  // }, []);

  return (
    <div className="cafe-game__table-customer-character" onClick={serve}>
      <img
        className={`cafe-game__table-customer-avatar ${served ? "leave" : ""}`}
        src={`/images/cafe-game/customers/${customer?.avatar}.svg`}
        ref={custAvatarRef}
        alt=""
      />
      <div
        className={`cafe-game__table-customer-order ${served ? "leave" : ""}`}
      >
        <RenderIf condition={!served}>
          {orders.map((order, index) => {
            const stock = cafeStocks.find((s) => s.id === order.stockId);
            if (!stock) {
              return null;
            }

            return (
              <div
                key={`order-${index}`}
                className="cafe-game__table-customer-order-item"
              >
                <img
                  className="cafe-game__table-customer-order-item-image"
                  src={`/images/cafe-game/${stock.image}.svg`}
                  alt=""
                />
                <div className="cafe-game__table-customer-order-item-x">x</div>
                <div className="cafe-game__table-customer-order-item-quantity">
                  {order.quantity}
                </div>
              </div>
            );
          })}
        </RenderIf>

        <RenderIf condition={served}>
          <div className="cafe-game__table-customer-earned">
            <div>Thanks!</div>
            <div>${earned}</div>
          </div>
        </RenderIf>
      </div>
    </div>
  );
}
