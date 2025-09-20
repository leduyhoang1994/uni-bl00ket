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
            <img src="/images/host/setting.svg" alt="" />
          </div>
          <div>Settings</div>
          <button onClick={doClickClose}>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" className="svg-inline--fa fa-times fa-w-11 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
          </button>
        </div>
        <div>
          <div className="settings-panel">
            <div className="row">
              <img src="/images/host/audio-mute.svg" width={30} height={25} alt="" />
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
                <img src="/images/host/audio-active.svg" width={30} height={25} alt="" />
              </RenderIf>
              <RenderIf condition={muted}>
                <img src="/images/host/audio-mute.svg" width={30} height={25} alt="" />
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