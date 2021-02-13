export enum PaletteColor {
  Blue = "blue",
  Gray = "gray",
  Green = "green",
  Indigo = "indigo",
  Pink = "pink",
  Purple = "purple",
  Red = "red",
  Yellow = "yellow",
}

export type PixelColor = string | null

export type Sprite = PixelColor[]
export const EMPTY_SPRITE = new Array(64).fill(null)
