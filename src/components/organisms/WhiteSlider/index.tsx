import { useEffect, useState } from "react"

import Slider from "components/atoms/Slider"
import useApi from "hooks/useApi"
import useDebounce from "hooks/useDebounce"
import { PaletteColor } from "types"

export default function WhiteSlider() {
  const [level, setLevel] = useState(0)
  const debouncedLevel = useDebounce(level, 500)

  const brightness = debouncedLevel.toString(16).padStart(2, "0")
  const [_f, fill] = useApi(
    {
      url: `/fill/000000${brightness}`,
      method: "POST",
    },
    { manual: true }
  )

  useEffect(() => {
    fill()
  }, [debouncedLevel, fill])

  return (
    <Slider
      color={PaletteColor.Yellow}
      value={level}
      range={{ min: 0, max: 255 }}
      onChange={setLevel}
    />
  )
}
