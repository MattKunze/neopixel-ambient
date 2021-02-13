import { PaletteColor } from "types"

export interface ToggleProps {
  color?: PaletteColor
  value: boolean
  onClick?: () => void
}

export default function Toggle({
  color = PaletteColor.Blue,
  value,
  onClick,
}: ToggleProps) {
  const intensity = value ? 500 : 300
  return (
    <div
      className={`
        inline-block p-1 rounded-full
        ring ring-${color}-${intensity}
        ${onClick ? "cursor-pointer" : ""}
      `}
      onClick={onClick}
    >
      <div
        className={`
          h-5 w-5 rounded-full
          ${value ? "mr" : "ml"}-6
          bg-${value ? color : "gray"}-${intensity}
        `}
      ></div>
    </div>
  )
}
