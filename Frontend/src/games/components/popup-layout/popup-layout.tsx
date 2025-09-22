import { DESIGN_VIEWPORT } from "@/games/application";
import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";

export default function PopupLayout({ chilren = <layoutContainer></layoutContainer> }) {
  useExtend({ LayoutContainer });
  const popupWidth = DESIGN_VIEWPORT.width;
  const popupHeight = DESIGN_VIEWPORT.height;
  return (
    <layoutContainer
      layout={{
        width: popupWidth,
        height: popupHeight,
        backgroundColor: "#00000080",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {chilren}
    </layoutContainer>
  )
}