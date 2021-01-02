import { useEffect, useState } from "react"

import Button from "components/atoms/Button"
import useApi from "hooks/useApi"
import { PaletteColor, Sprite } from "types"

interface Props {
  color: string | null
  sprite: Sprite
}
export default function Controls({ color, sprite }: Props) {
  const [sync, setSync] = useState(true)
  const [_f, fill] = useApi(
    {
      url: `/fill/${encodeURIComponent(color || "")}`,
      method: "POST",
    },
    { manual: true }
  )
  const [_o, off] = useApi(
    {
      url: `/fill/000`,
      method: "POST",
    },
    { manual: true }
  )
  const [_s, sendSprite] = useApi(
    {
      url: `/sprite`,
      method: "POST",
      data: sprite,
    },
    { manual: true }
  )

  useEffect(() => {
    if (sync) {
      sendSprite()
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
      <Button text="Fill" disabled={!color} onClick={fill} />
      <Button
        text="Off"
        color={PaletteColor.Gray}
        intensity={100}
        onClick={off}
      />
    </div>
  )
}
