import { useState } from "react"
import { RefreshOutline } from "heroicons-react"

import Button from "components/atoms/Button"
import PaletteSwatch from "components/molecules/PaletteSwatch"
import PixelGrid from "components/molecules/PixelGrid"
import Controls from "components/organisms/Controls"
import WhiteSlider from "components/organisms/WhiteSlider"
import { EMPTY_SPRITE, PaletteColor, PixelColor, Sprite } from "types"
import { createStripedSprite } from "utils/sprites"

const PALETTE = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#4d908e",
  "#277da1",
]

export default function Home() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [sprite, setSprite] = useState<Sprite>(EMPTY_SPRITE)

  const mutate = (color: PixelColor, index: number) => {
    const update = [...sprite]
    update[index] = color
    setSprite(update)
  }

  const stripes = () => {
    setSprite(createStripedSprite(PALETTE))
  }

  return (
    <div className="container mx-auto m-4 grid grid-flow-row gap-4">
      <PixelGrid
        sprite={sprite}
        editable={true}
        fillPixel={mutate.bind(null, selectedColor)}
        clearPixel={mutate.bind(null, null)}
      />

      <div className="flex flex-row gap-2">
        <Button
          text="Clear"
          icon={<RefreshOutline />}
          color={PaletteColor.Gray}
          intensity={100}
          onClick={() => setSprite(EMPTY_SPRITE)}
        />
        <Button
          text="Stripes!"
          color={PaletteColor.Gray}
          intensity={100}
          onClick={() => stripes()}
        />
      </div>

      <PaletteSwatch
        colors={PALETTE}
        selectedColor={selectedColor}
        onSelect={setSelectedColor}
      />

      <Controls color={selectedColor} sprite={sprite} />

      <WhiteSlider />
    </div>
  )
}
