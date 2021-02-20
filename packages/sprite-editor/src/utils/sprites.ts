import { EMPTY_SPRITE, Sprite } from "types"

export const createStripedSprite = (colors: string[], cols = 8): Sprite => {
  const sprite = [...EMPTY_SPRITE]
  for (let row = 0; row < Math.min(8, colors.length); row++) {
    for (let col = 0; col < cols; col++) {
      sprite[row * 8 + col] = colors[row]
    }
  }
  return sprite
}
