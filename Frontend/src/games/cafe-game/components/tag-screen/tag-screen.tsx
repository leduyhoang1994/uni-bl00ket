
import { useExtend } from "@pixi/react";
import { Graphics, Text } from "pixi.js";

type TagScreenProps = {
  value: number;
  paddingX?: number;
  paddingY?: number;
  height?: number;
  radius?: number;
  borderWidth?: number;
  backgroundColor?: number;
  borderColor?: number;
};

export default function TagScreen({
  value,
  paddingX = 20,
  paddingY = 10,
  height = 50,
  radius = 10,
  borderWidth = 4,
  backgroundColor = 0x0174bb,
  borderColor = 0x023b6a,
}: TagScreenProps) {
  useExtend({ Graphics, Text });

  const text = `$${value}`;
  const fontSize = 30;

  // Ước lượng width text theo độ dài chuỗi
  const textWidth = text.length * (fontSize * 0.6);

  // Chiều rộng box tính theo text + padding
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = height;

  const drawBackground = (g: Graphics) => {
    g.clear();
    g.moveTo(0, 0)
      .lineTo(0, boxHeight - radius)
      .quadraticCurveTo(0, boxHeight, radius, boxHeight)
      .lineTo(boxWidth - radius, boxHeight)
      .quadraticCurveTo(boxWidth, boxHeight, boxWidth, boxHeight - radius)
      .lineTo(boxWidth, 0);

    g.fill({ color: backgroundColor });
    g.stroke({
      width: borderWidth,
      color: borderColor,
      alignment: 0.5,
      join: 'round',
      cap: 'butt',
    });
  };

  return (
    <pixiContainer label="MoneyBox">
      <pixiGraphics draw={drawBackground} />
      <pixiText
        text={text}
        style={{
          fontSize,
          fontWeight: "700",
          fill: "white",
        }}
        anchor={0.5}
        resolution={2}
        x={boxWidth / 2}
        y={boxHeight / 2}
      />
    </pixiContainer>
  );
}
