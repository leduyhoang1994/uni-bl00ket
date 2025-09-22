import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";
import LeaderBoardScreenUser from "./components/leader-board-screen-user";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import HostStore from "@/stores/host-store/host-store";
import { HostLeaderboardItem } from "@common/types/host.type";
import { DESIGN_VIEWPORT } from "@/games/application";

export default function LeaderboardScreen() {
  useExtend({ LayoutContainer });
  const { setToggleLeaderBoard } = CafeGameStore();
  const { leaderboard, userInfo } = HostStore();

  const layoutWidth = DESIGN_VIEWPORT.width;
  const layoutHeight = DESIGN_VIEWPORT.height;
  const leaderBoardWidth = DESIGN_VIEWPORT.width * 0.85;
  const paddingLayout = 15;

  return (
    <layoutContainer
      label="Leader board screen"
      layout={{
        width: layoutWidth,
        height: layoutHeight,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}

      onPointerTap={() => setToggleLeaderBoard(false)}
      cursor="pointer"
    >
      <layoutContainer
        layout={{
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <layoutContainer
          label="Leader board"
          layout={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: leaderBoardWidth,
            height: 55,
            backgroundColor: "#000c",
            padding: paddingLayout,
          }}
          cursor="pointer"
        >
          <pixiText
            text={"LEADERBOARD"}
            style={{
              fontSize: 24,
              fontWeight: "500",
              fill: "white",
            }}
            layout
            resolution={2}
          />
          <pixiText
            text={"SCORE"}
            style={{
              fontSize: 18,
              fontWeight: "500",
              fill: "white",
            }}
            layout={{
              width: 150,
            }}
            resolution={2}
          />
        </layoutContainer>
        <layoutContainer
          layout={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {leaderboard.map((item: HostLeaderboardItem, index: number) => {
            let hasCurrentUser = false;
            if (item.playerId === userInfo?.id) {
              hasCurrentUser = true;
            }
            return (
              <LeaderBoardScreenUser
                key={index}
                item={item}
                hasCurrentUser={hasCurrentUser}
              />
            );
          })}
        </layoutContainer>
      </layoutContainer>
    </layoutContainer>
  );
}
