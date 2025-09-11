import { useEffect, useState } from "react";
import { Assets, Texture } from "pixi.js";

export function usePixiTexture(path: string) {
  const [texture, setTexture] = useState<Texture>(Texture.EMPTY);

  useEffect(() => {
    let mounted = true;
    Assets.load(path).then((tex) => {
      if (mounted) setTexture(tex);
    });
    return () => { mounted = false };
  }, [path]);

  return texture;
}
