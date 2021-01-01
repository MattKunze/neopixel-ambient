import { PropsWithChildren } from "react"

interface Props {
  color: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}
export default function Button({
  color = "green",
  active,
  disabled,
  onClick,
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      disabled={disabled}
      className={`
        flex flex-row
        px-5 py-2 rounded-md shadow-md
        cursor-pointer disabled:cursor-not-allowed
        ${active ? "ring" : ""}
        bg-${color}-500 active:bg-${color}-700 disabled:opacity-50
        ${color === "white" ? "text-black" : "text-white"}
        focus:outline-none
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
