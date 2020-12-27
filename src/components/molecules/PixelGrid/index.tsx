import { useMeasure } from "react-use"
import { Box } from "@material-ui/core"

import Pixel from "../../atoms/Pixel"

const SIZE = 8
const SIZE_ARRAY = Array(SIZE).fill(null)

export default function PixelGrid() {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const pixelSize = width / SIZE

  return (
    <div ref={ref}>
      {SIZE_ARRAY.map((_, rowIndex) => (
        <Box
          key={rowIndex}
          display="flex"
          flexDirection="row"
          sx={{ height: pixelSize }}
          // display="flex"
          // flexDirection="row"
          // height={pixelSize}
        >
          {SIZE_ARRAY.map((_, colIndex) => (
            <Pixel key={colIndex} color={`#0${rowIndex}${colIndex}`} />
          ))}
        </Box>
      ))}
    </div>
  )
}
