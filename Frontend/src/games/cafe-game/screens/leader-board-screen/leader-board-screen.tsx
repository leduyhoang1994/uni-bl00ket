import { LayoutContainer } from "@pixi/layout/components";
import { useApplication, useExtend } from "@pixi/react";
import LeaderBoardScreenUser from "./components/leader-board-screen-user";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";

export default function LeaderboardScreen() {
  useExtend({ LayoutContainer });
  const { setToggleLeaderBoard } = CafeGameStore();
  const { app } = useApplication();
  const leaderBoardWidth = app.screen.width * 0.85;
  const paddingLayout = 15;

  return (
    <layoutContainer
      layout={{
        width: app.screen.width,
        height: app.screen.height,
        backgroundColor: "transparent",
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: "column",
        alignItems: "center"
      }}
      onClick={() => setToggleLeaderBoard(false)}
      cursor="pointer"
    >
      <layoutContainer
        layout={{
          borderRadius: 10,
          display: 'flex',
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <layoutContainer label="Leader board" layout={{
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
              width: 150
            }}
            resolution={2}
          />
        </layoutContainer>
        <layoutContainer
          layout={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {[1, 2].map((value, index: number) => {
            let hasCurrentUser = false;
            if (index == 0) {
              hasCurrentUser = true
            }
            return (
              <LeaderBoardScreenUser key={index} hasCurrentUser={hasCurrentUser} />
            )
          })}
        </layoutContainer>
      </layoutContainer>
    </layoutContainer >
  )
}