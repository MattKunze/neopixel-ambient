import colors, { ColorName } from "tailwindcss/colors"

export const Rainbow = ([
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "cyan",
  "blue",
  "purple",
] as ColorName[]).map((c) => colors[c][900])
