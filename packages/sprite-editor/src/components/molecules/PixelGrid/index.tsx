import Pixel from "components/atoms/Pixel"
import { Sprite } from "types"

interface EditProps {
  editable: true
  fillPixel: (index: number) => void
  clearPixel: (index: number) => void
}
interface ReadonlyProps {
  editable: false
}

type Props = (EditProps | ReadonlyProps) & {
  sprite: Sprite
}

export default function PixelGrid(props: Props) {
  return (
    <div className="grid grid-cols-8 gap-1 w-96 h-96">
      {new Array(64).fill(null).map((_, index) => (
        <Pixel
          key={index}
          color={props.sprite[index]}
          onFill={
            props.editable
              ? (fill) => {
                  fill === "color"
                    ? props.fillPixel(index)
                    : props.clearPixel(index)
                }
              : undefined
          }
        >
          {index}
        </Pixel>
      ))}
    </div>
  )
}
