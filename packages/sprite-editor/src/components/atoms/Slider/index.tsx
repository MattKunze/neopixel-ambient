import { PaletteColor } from "types"

export interface SliderProps {
  value: number
  range: {
    min: number
    max: number
  }
  color?: PaletteColor
  onChange: (value: number) => void
}
export default function Slider({
  value,
  range,
  color = PaletteColor.Blue,
  onChange,
}: SliderProps) {
  return (
    <div
      className={`
        flex flex-row items-center
        h-8 px-3
        border-1 border-black
      `}
    >
      <input
        className={`
          appearance-none focus:outline-none
          h-1 w-full
          rounded-full
          bg-gray-200
          slider-thumb ${color}
        `}
        type="range"
        value={value}
        min={range.min}
        max={range.max}
        step={1}
        onChange={(ev) => onChange(parseInt(ev.target.value, 10))}
      />
    </div>
  )
}
