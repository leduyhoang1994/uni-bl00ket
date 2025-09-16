import { HostLeaderboardItem } from "@common/types/host.type";
import { LayoutContainer } from "@pixi/layout/components";
import { useApplication, useExtend } from "@pixi/react";
import { Assets } from "pixi.js";

export default function LeaderBoardScreenUser({
  hasCurrentUser = false,
  item,
}: {
  hasCurrentUser: boolean;
  item: HostLeaderboardItem;
}) {
  useExtend({ LayoutContainer });
  const { app } = useApplication();
  const leaderBoardWidth = app.screen.width * 0.85;
  const userTexture = Assets.get(`cust-alpaca`);
  const currentUserObj = hasCurrentUser
    ? { backGroundColor: "rgba(255, 255, 255, 0.5)", textColor: "black" }
    : { backGroundColor: "rgba(0, 0, 0, 0.8)", textColor: "white" };
  return (
    <layoutContainer
      layout={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: leaderBoardWidth,
        backgroundColor: currentUserObj.backGroundColor,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <layoutContainer
        layout={{
          display: "flex",
          alignItems: "center",
          height: 45,
          gap: 10,
        }}
        cursor="pointer"
      >
        <pixiSprite
          layout={{
            width: 40,
            height: 35,
            objectFit: "contain",
          }}
          texture={userTexture}
        />
        <pixiText
          text={item.username}
          style={{
            fontSize: 24,
            fontWeight: "500",
            fill: currentUserObj.textColor,
          }}
          layout
          resolution={2}
        />
      </layoutContainer>
      <pixiText
        text={`$${item.score}`}
        style={{
          fontSize: 24,
          fontWeight: "500",
          fill: currentUserObj.textColor,
        }}
        layout={{
          width: 160,
          height: 35,
        }}
        resolution={2}
      />
    </layoutContainer>
  );
}
