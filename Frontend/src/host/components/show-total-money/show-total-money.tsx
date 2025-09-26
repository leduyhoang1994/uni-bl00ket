import HostStore from "@/stores/host-store/host-store";

export default function ShowTotalMoney() {
  const { leaderboard } = HostStore();
  const highest = leaderboard[0]?.score || 0;

  return (
    <div className="show-total-money">
      <div className="show-total-money__content change-to-period">${highest}</div>
    </div>
  );
}
