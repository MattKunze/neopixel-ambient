import Pixel from "components/atoms/Pixel"
import { Sprite } from "types"

interface Props {
  sprite: Sprite
  fillPixel: (index: number) => void
  clearPixel: (index: number) => void
}

export default function PixelGrid({ sprite, fillPixel, clearPixel }: Props) {
  return (
    <div className="grid grid-cols-8 gap-1 w-96 h-96">
      {new Array(64).fill(null).map((_, index) => (
        <Pixel
          key={index}
          color={sprite[index]}
          onFill={(fill) => {
            fill === "color" ? fillPixel(index) : clearPixel(index)
          }}
        >
          {index}
        </Pixel>
      ))}
    </div>
  )
}
