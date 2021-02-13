import { PropsWithChildren } from "react"

import { PixelColor } from "types"

interface Props {
  color: PixelColor
  onFill?: (fill: "color" | "clear") => void
}
export default function Pixel({
  color,
  onFill,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`
        flex items-center justify-center
        rounded-md
        ${onFill ? "cursor-pointer" : ""}
        border border-gray-200
        text-xl text-gray-500 hover:text-gray-700
      `}
      style={{ backgroundColor: color || undefined }}
      onClick={() => onFill?.("color")}
      onContextMenu={(ev) => {
        onFill?.("clear")
        ev.preventDefault()
      }}
    >
      {children}
    </div>
  )
}
