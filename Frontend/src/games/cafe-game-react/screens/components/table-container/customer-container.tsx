import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { useLayoutEffect } from "react";
import Customer from "./customer";

export default function CustomerContainer() {
  const { loadCustomers, customers } = CafeGameStore();

  console.log(customers);

  useLayoutEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="cafe-game__table-customer-container">
      {customers.map((customer, position) => (
        <div
          key={`customer-${position + 1}`}
          className="cafe-game__table-customer-slot"
        >
          <Customer position={position + 1} />
        </div>
      ))}
    </div>
  );
}
