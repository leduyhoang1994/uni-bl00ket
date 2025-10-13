import UniButton from "@/games/components/buttons/uni-button";
import AvatarPicker from "@/host/waiting-lobby-player/avatar-picker";
import RenderIf from "@/utils/condition-render";
import { getAvatarById, SCREEN_SIZES_ENUM, UrlGenerator } from "@/utils/utils";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import FormSubmit from "../form-submit/form-submit";

export default function ChooseAvatarHostPlayer({
  username = "",
  nickNameValue = (e: ChangeEvent<HTMLInputElement>) => {},
  joinHost = async (avatar: string) => {},
}) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userAvatar, setUserAvatar] = useState("chick");
  const [changeUserName, setChangeUserName] = useState(false);

  const handleChangeName = () => {
    setChangeUserName(true);
  };

  useLayoutEffect(() => {
    const maxMobile = SCREEN_SIZES_ENUM.MOBILE_W;

    const checkScreen = () => {
      const screenW = window.innerWidth;
      const mobile = screenW <= maxMobile;
      setIsMobile(mobile);
      if (!mobile) {
        setShowAvatarPicker(false);
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="waiting-lobby-player__choose-avatar-host-player">
      <RenderIf condition={(isMobile && showAvatarPicker) || !isMobile}>
        <div
          className="dismiss-back"
          onClick={() => setShowAvatarPicker(false)}
        ></div>
        <AvatarPicker
          pickedCallback={(avatarId: string) => {
            const maxMobile = SCREEN_SIZES_ENUM.MOBILE_W;
            setUserAvatar(avatarId);
            const screenW = window.innerWidth;
            if (screenW <= maxMobile) {
              setShowAvatarPicker(false);
            }
          }}
        />
      </RenderIf>
      <RenderIf condition={(isMobile && !showAvatarPicker) || !isMobile}>
        <div className="waiting-lobby-player__body-content">
          <div className="waiting-lobby-player__body-content-cover-avatar">
            <UniButton
              text="Đổi ảnh đại diện"
              className="waiting-lobby-player__body-content-change-avatar"
              onClick={() => {
                setShowAvatarPicker(true);
              }}
            />
            <div className="waiting-lobby-player__body-content-avatar">
              <img src={getAvatarById(userAvatar)} alt="" />
              <div className="ribbon"></div>
            </div>
            <RenderIf condition={!changeUserName}>
              <div className="waiting-lobby-player__body-content-username">
                <div>{username}</div>
                <img
                  src="/images/icons/write-name.svg"
                  alt="change-name"
                  onClick={handleChangeName}
                />
              </div>
            </RenderIf>
            <RenderIf condition={changeUserName}>
              <FormSubmit
                textTitle=""
                placeholderText="Biệt danh"
                inputClass="host-player__body-main-cover-input-nick-name"
                maxLength={15}
                onChangeInputValue={nickNameValue}
                btnOnclick={() => setChangeUserName(false)}
              />
            </RenderIf>
          </div>

          <UniButton
            text="Chơi ngay"
            onClick={() => {
              joinHost(userAvatar);
            }}
          />
        </div>
      </RenderIf>
    </div>
  );
}
