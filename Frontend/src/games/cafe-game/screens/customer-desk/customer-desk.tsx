import CustomerContainer from "./components/customer-container";
import TableContainer from "./components/table-container";
import WallContainer from "./components/wall-container";

export default function CustomerDesk() {
  return (
    <>
      <WallContainer />
      <CustomerContainer />
      <TableContainer />
    </>
  )
}