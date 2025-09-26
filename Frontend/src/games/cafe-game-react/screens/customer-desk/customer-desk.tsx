import MenuLayout from "../components/menu/menu-layout";
import CustomerContainer from "../components/table-container/customer-container";
import TableContainer from "../components/table-container/table-container";
import WallContainer from "../components/wall-container/wall-container";

export default function CustomerDesk() {
  return (
    <div className="cafe-game">
      <WallContainer />
      <CustomerContainer />
      <TableContainer />
      <MenuLayout />
    </div>
  )
}