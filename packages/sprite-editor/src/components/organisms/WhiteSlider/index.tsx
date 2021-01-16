import { useEffect, useState } from "react"

import Slider from "components/atoms/Slider"
import useBroker from "hooks/useBroker"
import useDebounce from "hooks/useDebounce"
import { PaletteColor } from "types"

export default function WhiteSlider() {
  const [level, setLevel] = useState(0)
  const debouncedLevel = useDebounce(level, 500)

  const { fill } = useBroker()

  useEffect(() => {
    const brightness = debouncedLevel.toString(16).padStart(2, "0")
    fill(`000000${brightness}`)
  }, [debouncedLevel])

  return (
    <Slider
      color={PaletteColor.Yellow}
      value={level}
      range={{ min: 0, max: 255 }}
      onChange={setLevel}
    />
  )
}
