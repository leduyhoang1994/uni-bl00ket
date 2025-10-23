import RenderIf from "@/game/common/utils/condition-render";
import { ActivityBoardItem } from "@common/types/host.type";
import { getGameController } from "@/game/common/game-controller.singleton";
import { useParams } from "react-router";
import { useLayoutEffect, useState } from "react";
import HostStore from "../../store";
import GameController from "@/game/common/game.controller";

export default function PlayerActivitiesBoard({
  activitiesBoard = [],
}: {
  activitiesBoard: ActivityBoardItem[];
}) {
  const { hostId } = useParams();
  const [gameController, setGameController] = useState<GameController | null>(
    null
  );
  const { hostInfo } = HostStore();

  const hasRecordPlayer = activitiesBoard.length > 0;

  useLayoutEffect(() => {
    if (!hostId || !hostInfo) {      
      return;
    }

    const controller = getGameController(hostInfo?.gameMode, hostId);
    setGameController(controller);
  }, [hostInfo]);

  if (!hostId || !gameController) {
    return null;
  }

  return (
    <div className="waiting-player-board">
      <RenderIf condition={hasRecordPlayer}>
        {activitiesBoard.map((value, index: number) => {
          return (
            <div className="waiting-player-board__user-action" key={index}>
              <div>
                <img height="100%" width="auto" src={value.avatar} alt="" />
              </div>
              <span>{`${value.username} ${gameController.decodeActivity(
                value.activity
              )}`}</span>
            </div>
          );
        })}
      </RenderIf>
      <RenderIf condition={!hasRecordPlayer}>
        <div className="waiting-player-board__no-record">
          <div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="clock"
              className="svg-inline--fa fa-clock fa-w-16 "
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"
              ></path>
            </svg>
          </div>
          <div>Waiting for Action...</div>
        </div>
      </RenderIf>
    </div>
  );
}
