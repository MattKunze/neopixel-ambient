import { useEffect, useState } from "react"

import Button from "components/atoms/Button"
import useBroker from "hooks/useBroker"
import { PaletteColor, Sprite } from "types"

interface Props {
  color: string | null
  sprite: Sprite
}
export default function Controls({ color, sprite }: Props) {
  const [sync, setSync] = useState(true)
  const broker = useBroker()

  useEffect(() => {
    if (sync) {
      broker.sprite(sprite)
    }
  }, [sprite, sync])

  return (
    <div className="flex flex-row gap-2">
      <Button
        text="Sync"
        color={PaletteColor.Yellow}
        active={sync}
        onClick={() => setSync(!sync)}
      />
      <Button
        text="Fill"
        disabled={!color}
        onClick={() => color && broker.fill(color)}
      />
      <Button
        text="Off"
        color={PaletteColor.Gray}
        intensity={100}
        onClick={broker.off}
      />
    </div>
  )
}
