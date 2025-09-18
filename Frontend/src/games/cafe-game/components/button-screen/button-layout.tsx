import { LayoutContainer } from "@pixi/layout/components";
import { useExtend } from "@pixi/react";

export default function ButtonLayout({
  layoutWidth = 300,
  layoutHeight = 100,
  chilren = <layoutContainer></layoutContainer>,
  doClickBtn = () => { }
}) {
  useExtend({ LayoutContainer });
  return (
    <layoutContainer
      cursor="pointer"
    >
      <layoutContainer
        layout={{
          position: "relative",
          overflow: "hidden",
          width: layoutWidth,
          height: layoutHeight,
          backgroundColor: "#099faa",
          borderRadius: 12,
          borderColor: "#0e6b71",
          borderWidth: 4,
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <layoutContainer
          layout={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: layoutWidth,
            height: 10,
            backgroundColor: "#118891", // màu bóng
          }}
        />
        {chilren}
      </layoutContainer >
    </layoutContainer>
  )
}