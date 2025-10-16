import { AVATARS_CUSTOMER } from "@/game/modes/cafe/model";
import { getAvatarById } from "@/game/common/utils/utils";
import { useCallback, useState } from "react";
import HostController from "../../../controller";
import { useParams } from "react-router";
import HostStore from "@/game/host/store";

export default function AvatarPicker({
  pickedCallback = () => { },
}: {
  pickedCallback: (avatarId: string) => void;
}) {
  const { hostId } = useParams();
  const { userInfo } = HostStore();
  const [currentAvatarIdx, setCurrentAvatarIdx] = useState(0);

  const updateAvatar = useCallback(
    async (avatarId: string, index: number) => {
      if (!hostId) {
        return;
      }
      const url = getAvatarById(avatarId);

      if (userInfo?.avatar != url) {
        const controller = await HostController.getInstance();
        await controller.updateAvatar(hostId, url);
      }

      pickedCallback(avatarId);
      setCurrentAvatarIdx(index);
    },
    [hostId, userInfo]
  );

  const avatars = AVATARS_CUSTOMER;
  return (
    <div className="waiting-lobby-player__body-avatar-picker">
      <div className="waiting-lobby-player__body-avatar-picker-viewport">
        <div className="waiting-lobby-player__body-avatar-picker-content">
          {avatars.map((avatar, index: number) => {
            return (
              <button
                onClick={() => updateAvatar(avatar, index)}
                key={avatar}
                className={`waiting-lobby-player__body-avatar-picker-content-avatar
                 ${currentAvatarIdx == index ? 'waiting-lobby-player__avatar-active' : ''}`}
              >
                <img src={getAvatarById(avatar)} alt="" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
