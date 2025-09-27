import { AVATARS_CUSTOMER } from "@/model/model";
import { getAvatarById } from "@/utils/utils";
import { useCallback } from "react";
import HostController from "../controllers/host.controller";
import { useParams } from "react-router";

export default function AvatarPicker({
  pickedCallback = () => {},
}: {
  pickedCallback: (avatarId: string) => void;
}) {
  const { hostId } = useParams();
  const updateAvatar = useCallback(
    async (avatarId: string) => {
      if (!hostId) {
        return;
      }
      const url = getAvatarById(avatarId);

      const controller = await HostController.getInstance();
      await controller.updateAvatar(hostId, url);

      pickedCallback(avatarId);
    },
    [hostId]
  );

  const avatars = AVATARS_CUSTOMER;
  return (
    <div className="waiting-lobby-player__body-avatar-picker">
      <div className="waiting-lobby-player__body-avatar-picker-viewport">
        <div className="waiting-lobby-player__body-avatar-picker-content">
          {avatars.map((avatar) => (
            <button
              onClick={() => updateAvatar(avatar)}
              key={avatar}
              className="waiting-lobby-player__body-avatar-picker-content-avatar"
            >
              <img src={getAvatarById(avatar)} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
