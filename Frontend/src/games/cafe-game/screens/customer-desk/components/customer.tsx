"use client";

import "@pixi/layout/react";
import "@pixi/layout";
import { useApplication, useExtend } from "@pixi/react";
import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { LayoutContainer } from "@pixi/layout/components";
import gsap from "gsap";
import RenderIf from "@/utils/condition-render";
import CafeGameStore from "@/games/stores/cafe-game-store/cafe-game-store";
import { getCafeControllerInstance } from "@/games/cafe-game/cafe-controller.singleton";

const CUSTOMER_AVATARS = [
  "alpaca",
  "chick",
  "chicken",
  "cow",
  "duck",
  "giraffe",
  "hedgehog",
  "parrot",
  "puppy",
  "toucan",
  "walrus",
];

const FOODS = [
  "blook-breakfast",
  "blook-cafe-level",
  "blook-cereal",
  "blook-french-waffle",
  "blook-milk-carton",
  "blook-orange-carton",
  "blook-pancake",
  "blook-toast",
  "blook-waffle",
  "blook-yogurt",
];

const FOOD_SIZE = 50;
const TEXT_SIZE = 50;
const AVATAR_WIDTH = 130;
const AVATAR_HEIGHT = 150;

function createTooltipBubble(app: any, options = {}) {
  const {
    foodCount = 3,
    width = 150,
    radius = 12,
    tailSize = 20,
    border = 5,
    fill = 0xffffff,
    stroke = 0x00a9c9, // màu viền xanh
  }: any = options;

  const height = foodCount * 60 + 20;

  const tailPos = height - 40;

  const g = new Graphics();

  // Thân chính (rounded rect)
  g.roundRect(0, 0, width, height, radius)
    .fill({ color: fill })
    .stroke({ color: stroke, width: border });

  // Đuôi bubble (tam giác nhỏ)
  g.moveTo(0, tailPos) // điểm ở cạnh trái
    .lineTo(-tailSize, tailPos + tailSize / 2)
    .lineTo(0, tailPos + tailSize)
    .closePath()
    .fill({ color: fill })
    .stroke({ color: stroke, width: border });

  // Convert sang texture
  const texture = app.renderer.generateTexture(g);
  return texture;
}

export default function Customer({ position, x, y }: any) {
  useExtend({ LayoutContainer });
  const { app } = useApplication();
  const {
    customers,
    cafeStocks,
    loadCustomers,
    loadCafeStocks,
    loadCafeBalance,
    pushServeAnimates,
  } = CafeGameStore();
  const customer = customers.find((c) => c.position === position);
  const [earned, setEarned] = useState(0);

  const appWidth = app?.screen?.width;

  const customerTexture = customer ? Assets.get(`cust-${customer?.avatar}`) : null;
  const foodCount = customer?.orders.length || 2;
  const [served, setServed] = useState(false);

  const custAvatarRef = useRef<Sprite>(new Sprite(Texture.EMPTY));
  const custFoodRef = useRef<Container>(new Container());
  const custRef = useRef<Container>(new Container());
  const orders = customer?.orders || [];
  const chatBubbleTexture = createTooltipBubble(app, { foodCount });

  useEffect(() => {
    custRef.current.on("pointerup", () => {
      // setServed(true);
      if (!customer) {
        return;
      }
      const gameController = getCafeControllerInstance();
      const serveResult = gameController.serve(customer?.id);

      loadCafeStocks();
      pushServeAnimates(
        serveResult.servedItems.map((item) => {
          return {
            ...item,
            position: custAvatarRef.current.getGlobalPosition(),
          };
        })
      );

      if (serveResult.servedAll) {
        setEarned(serveResult.totalEarned || 0);
        setServed(true);
        loadCafeBalance();
      }
    });
  }, [customers.find((c) => c.position == position)?.id]);

  useEffect(() => {
    if (!customer?.firstLoad) {
      gsap.fromTo(
        custAvatarRef.current,
        { x: 0 - AVATAR_WIDTH * 2 },
        {
          x: x - 130 / 2,
          duration: 0.5,
        }
      );
      gsap.fromTo(
        custFoodRef.current.scale,
        { x: 0, y: 0 },
        {
          x: 1,
          y: 1,
          delay: 0.2,
          duration: 0.3,
        }
      );
      const gameController = getCafeControllerInstance();
      gameController.setFirstLoad(customer?.id, true);
    }
  }, [customers.find((c) => c.position == position)?.id]);

  useEffect(() => {
    if (served) {
      const custAvatar = custAvatarRef.current;
      gsap.fromTo(
        custAvatar,
        { y: custAvatar.y - 10 },
        {
          y: custAvatar.y + 10,
          duration: 0.07,
          repeat: 4,
          yoyo: true,
          onComplete: () => {
            gsap.to(custFoodRef.current.scale, {
              x: 0,
              y: 0,
              duration: 0,
            });
            gsap.to(custAvatar, {
              x: appWidth + 200,
              y: y + 10,
            });

            setTimeout(() => {
              const gameController = getCafeControllerInstance();
              gameController.removeCustomerByPosition(position);
              loadCustomers();
              setServed(false);
            }, 1500);
          },
        }
      );
    }
  }, [served]);

  return (
    <pixiContainer
      interactive={true}
      label="Customer cafe-game"
      cursor="pointer"
      ref={custRef}
    >
      <pixiSprite
        ref={custAvatarRef}
        anchor={{ x: 0.5, y: 1 }}
        width={AVATAR_WIDTH}
        height={AVATAR_HEIGHT}
        x={x - 130 / 2}
        // y={y + 10}
        // x={0 - AVATAR_WIDTH}
        y={y + 10}
        texture={customerTexture}
      />
      <pixiContainer
        x={x - 10}
        y={y - 30}
        pivot={{ x: 0, y: 0.5 }}
        ref={custFoodRef}
      >
        <pixiSprite anchor={{ x: 0, y: 1 }} texture={chatBubbleTexture} />
        <pixiContainer x={30} y={(-FOOD_SIZE - 15) * foodCount}>
          <RenderIf condition={!served}>
            {orders.map((order, index) => {
              const foodTexture = Assets.get(
                `${cafeStocks.find((s) => s.id === order.stockId)?.image}`
              );
              const quantity = order.quantity;
              return (
                <pixiContainer key={index} y={index * (FOOD_SIZE + 10 + 5)}>
                  <pixiSprite
                    layout={false}
                    height={FOOD_SIZE}
                    width={FOOD_SIZE}
                    texture={foodTexture}
                  />
                  <pixiText
                    text={"x"}
                    x={FOOD_SIZE + 10}
                    y={10}
                    style={{ fontSize: TEXT_SIZE - 10 }}
                  />
                  <pixiText
                    text={quantity}
                    x={FOOD_SIZE + 40}
                    style={{ fontSize: TEXT_SIZE }}
                  />
                </pixiContainer>
              );
            })}
          </RenderIf>

          <RenderIf condition={served}>
            <pixiText
              text={"Thanks!"}
              anchor={{ x: 0.5, y: 0.5 }}
              x={68}
              y={(FOOD_SIZE * foodCount) / 2 - 15}
              style={{ fontSize: 30 }}
            />
            <pixiText
              text={`$${earned}`}
              anchor={{ x: 0.5, y: 0.5 }}
              x={68}
              y={(FOOD_SIZE * foodCount) / 2 - 15 + 30}
              style={{ fontSize: 27 }}
            />
          </RenderIf>
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
}
