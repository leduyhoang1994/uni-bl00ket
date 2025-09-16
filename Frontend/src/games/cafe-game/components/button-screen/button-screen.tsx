"use client";

import { useCallback, useEffect, useRef } from "react";
import { Graphics, TextStyle, Text, Container } from "pixi.js";
import { useExtend } from "@pixi/react";
import gsap from "gsap";

export default function ButtonScreen({
  btnWidth = 250,
  btnHeight = 80,
  btnRadius = 10,
  btnText = "Visit Shop",
  btnContainerX = 0,
  btnContainerY = 0,
  doClickBtn = () => {},
}) {
  useExtend({ Graphics, Text });

  const btn = useRef<Container>(null);

  const buttonWidth = btnWidth;
  const buttonHeight = btnHeight;
  const radius = btnRadius;

  // --- Màu sắc ---
  const mainColor = "#099FAA";
  const borderColor = "#0e6b71";
  const textColor = "#FFFFFF";
  const shadowColor = "#118891";
  const shadowHeight = 5;
  const borderWidth = 4;

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      g.roundRect(0, 0, buttonWidth, buttonHeight, radius).fill({
        color: borderColor,
      });
      g.roundRect(
        borderWidth,
        borderWidth,
        buttonWidth - borderWidth * 2,
        buttonHeight - borderWidth * 2,
        radius - borderWidth
      ).fill({ color: shadowColor });
      g.roundRect(
        borderWidth,
        borderWidth,
        buttonWidth - borderWidth * 2,
        buttonHeight - borderWidth * 2 - shadowHeight,
        radius - borderWidth
      ).fill({ color: mainColor });
    },
    [
      buttonWidth,
      buttonHeight,
      radius,
      mainColor,
      borderColor,
      shadowColor,
      shadowHeight,
      borderWidth,
    ]
  );

  const textStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: "30%",
    fontWeight: "700",
    fill: textColor,
    align: "center",
  });

  useEffect(() => {
    btn.current?.on("pointerover", () => {
      gsap.to(btn.current, { y: btnContainerY - 5, duration: 0.1 });
    });

    btn.current?.on("pointerout", () => {
      gsap.to(btn.current, { y: btnContainerY, duration: 0.1 });
    });
  }, []);

  return (
    <pixiContainer
      x={btnContainerX}
      y={btnContainerY}
      ref={btn}
      interactive={true}
      eventMode="static"
      cursor="pointer"
      onPointerUp={() => {
        if (!btn.current) {
          return;
        }

        btn.current.interactive = false;
        doClickBtn();
        setTimeout(() => {
          if (!btn.current) {
            return;
          }
          btn.current.interactive = true;
        }, 200);
      }}
    >
      <pixiGraphics draw={draw} eventMode="static" cursor="pointer" />
      <pixiText
        text={btnText}
        style={textStyle}
        anchor={0.5}
        x={buttonWidth / 2}
        y={buttonHeight / 2}
        resolution={2}
      />
    </pixiContainer>
  );
}
