import CafeController from "@/game/modes/cafe/controller";
import RenderIf from "@/game/common/utils/condition-render";
import { ActivityBoardItem } from "@common/types/host.type";

export default function PlayerActivitiesBoard({
  activitiesBoard = [],
}: {
  activitiesBoard: ActivityBoardItem[];
}) {
  const hasRecordPlayer = activitiesBoard.length > 0;
  return (
    <div className="waiting-player-board">
      <RenderIf condition={hasRecordPlayer}>
        {activitiesBoard.map((value, index: number) => {
          return (
            <div className="waiting-player-board__user-action" key={index}>
              <div>
                <img src={value.avatar} alt="" />
              </div>
              <span>{`${value.username} ${CafeController.decodeActivity(value.activity)}`}</span>
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
