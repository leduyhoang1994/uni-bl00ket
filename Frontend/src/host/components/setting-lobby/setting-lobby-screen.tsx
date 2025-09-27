import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import { useEffect, useRef, useState } from "react";
import RenderIf from "@/utils/condition-render";
import gsap from "gsap";
import HostStore from "@/stores/host-store/host-store";

export default function SettingLobbyScreen() {
  const { toggleSetting, setToggleSetting } = HostStore();
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [lastVolume, setLastVolume] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);

  const doClickClose = () => {
    setToggleSetting(false);
  }

  const handleMuteToggle = (checked: boolean) => {
    if (checked) {
      setLastVolume(volume[0]);
      setVolume([0]);
      setMuted(true);
    } else {
      setVolume([lastVolume || 50]);
      setMuted(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (value[0] === 0) {
      setMuted(true);
    } else {
      setMuted(false);
      setLastVolume(value[0]);
    }
  };

  useEffect(() => {
    if (toggleSetting && boxRef.current) {
      const background = document.querySelector('.setting-lobby-screen__background');
      background?.classList.add('setting-lobby-screen__show');
      gsap.fromTo(
        boxRef.current,
        { x: 600, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.2 }
      );
    }
    if (!toggleSetting && boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { x: 0, opacity: 1 },
        {
          x: 600, opacity: 0, duration: 0.2,
          onComplete: () => {
            const background = document.querySelector('.setting-lobby-screen__background');
            background?.classList.remove('setting-lobby-screen__show');
            console.log(background);

          }
        },
      );
    }

  }, [toggleSetting]);

  return (
    <div className="setting-lobby-screen__background" onClick={doClickClose}>
      <div className="setting-lobby-screen" ref={boxRef} onClick={(e) => e.stopPropagation()}>
        <div className="setting-lobby-screen__header">
          <div>
            {/* <img src="/images/icons/setting.svg" alt="" /> */}
          </div>
          <div>Settings</div>
          <button onClick={doClickClose}>
            <img src="/images/icons/setting-close-icon.svg" alt="" width={16.5} height={40} />
          </button>
        </div>
        <div>
          <div className="settings-panel">
            <div className="row">
              <img src="/images/icons/audio-mute.svg" width={30} height={25} alt="" />
              <span className="label"> Mute</span>
              <Switch.Root
                className="switch"
                checked={muted}
                onCheckedChange={handleMuteToggle}
              >
                <Switch.Thumb className="thumb" />
              </Switch.Root>
            </div>
            <div className="row">
              <RenderIf condition={!muted}>
                <img src="/images/icons/audio-active.svg" width={30} height={25} alt="" />
              </RenderIf>
              <RenderIf condition={muted}>
                <img src="/images/icons/audio-mute.svg" width={30} height={25} alt="" />
              </RenderIf>
              <span className="label-volum"> Volume</span>
              <Slider.Root
                className="slider"
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
              >
                <Slider.Track className="track">
                  <Slider.Range className="range" />
                </Slider.Track>
                <Slider.Thumb className="slider-thumb" />
              </Slider.Root>
              <span className="value">{volume[0]}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}