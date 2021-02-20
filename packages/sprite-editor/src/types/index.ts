export enum PaletteColor {
  Amber = "amber",
  Blue = "blue",
  BlueGray = "blueGray",
  CoolGray = "coolGray",
  Cyan = "cyan",
  Emerald = "emerald",
  Fuchsia = "fuchsia",
  Gray = "gray",
  Green = "green",
  Indigo = "indigo",
  LightBlue = "lightBlue",
  Lime = "lime",
  Orange = "orange",
  Pink = "pink",
  Purple = "purple",
  Red = "red",
  Rose = "rose",
  Teal = "teal",
  TrueGray = "trueGray",
  Violet = "violet",
  WarmGray = "warmGray",
  Yellow = "yellow",
}

export type PixelColor = string | null

export type Sprite = PixelColor[]
export const EMPTY_SPRITE = new Array(64).fill(null)
