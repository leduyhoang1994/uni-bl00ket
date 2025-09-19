import { LayoutContainer } from "@pixi/layout/components";
import { useApplication, useExtend } from "@pixi/react";

export default function PopupLayout({ chilren = <layoutContainer></layoutContainer> }) {
  useExtend({ LayoutContainer });
  const { app } = useApplication();
  return (
    <layoutContainer
      layout={{
        width: app.screen.width,
        height: app.screen.height,
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