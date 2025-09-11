import { Texture } from "pixi.js";

/**
 * Tính toán thông số để TilingSprite lặp ảnh
 * @param texture   - Pixi Texture
 * @param boxWidth  - Chiều rộng container
 * @param boxHeight - Chiều cao container
 */
export function fitRepeatTexture(texture: Texture, boxWidth: number, boxHeight: number) {
  if (!texture || texture === Texture.EMPTY) {
    return {
      width: boxWidth,
      height: boxHeight,
      tileScale: { x: 1, y: 1 }
    };
  }

  // Tính scale theo chiều cao
  const scale = boxHeight / texture.height;

  return {
    width: boxWidth,
    height: boxHeight,
    tileScale: { x: scale, y: scale }
  };
}
