export interface PaletteSwatchProps {
  colors: string[]
  selectedColor: string | null
  onSelect: (color: string) => void
}

export default function PaletteSwatch({
  colors,
  selectedColor,
  onSelect,
}: PaletteSwatchProps) {
  return (
    <div className="h-32 w-96 flex flex-col shadow rounded-3xl overflow-hidden">
      <div className="flex flex-row flex-1">
        {colors.map((color, index) => (
          <div
            key={`${index}_${color}`}
            className={`
              flex items-center justify-center flex-1 hover:flex-auto
              truncate text-transparent hover:text-black
              border-2 border-opacity-50 ${
                color === selectedColor ? "border-black" : "border-transparent"
              }
              first:rounded-tl-3xl
              last:rounded-tr-3xl
            `}
            style={{ backgroundColor: color }}
            onClick={() => onSelect(color)}
          >
            {color.slice(1)}
          </div>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-100">
        {selectedColor || "Select a color"}
      </div>
    </div>
  )
}
