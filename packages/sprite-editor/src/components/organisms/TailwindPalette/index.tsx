import { useEffect } from "react"
import colors, { ColorIntensity, ColorName } from "tailwindcss/colors"

import PaletteSwatch from "components/molecules/PaletteSwatch"
import useBroker from "hooks/useBroker"
import { createStripedSprite } from "utils/sprites"

interface SharedProps {
  selectedColor: string | null
  onSelect: (color: string) => void
}

export interface ColorRangeProps extends SharedProps {
  color: ColorName
}

export interface SwatchProps extends SharedProps {
  colors: ColorName[]
  intensity: ColorIntensity
}

export type TailwindPaletteProps = ColorRangeProps | SwatchProps

export default function TailwindPalette(props: TailwindPaletteProps) {
  const { sprite } = useBroker()

  let palette: string[]
  if ("intensity" in props) {
    palette = props.colors.map((c) => colors[c][props.intensity])
  } else {
    palette = Object.values(colors[props.color])
    palette.splice(1, 1)
    palette.splice(7, 1)
  }

  useEffect(() => {
    sprite(createStripedSprite(palette, 8))
  }, [palette.join()])

  return (
    <PaletteSwatch
      colors={palette}
      selectedColor={props.selectedColor}
      onSelect={props.onSelect}
    />
  )
}
