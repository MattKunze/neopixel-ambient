import { useState } from "react"
import { Meta, Story } from "@storybook/react"

import { PaletteColor } from "types"
import Toggle, { ToggleProps } from "./"

export default {
  title: "Atoms/Toggle",
  component: Toggle,
  argTypes: {
    color: {
      control: {
        type: "inline-radio",
        options: Object.values(PaletteColor),
      },
    },
  },
} as Meta

const Template: Story<ToggleProps> = (props) => <Toggle {...props} />

export const Defaults = Template.bind({})
Defaults.args = {
  color: PaletteColor.Blue,
  value: true,
  onClick: undefined,
}

export const WithState = () => {
  const [value, setValue] = useState(false)
  return <Toggle value={value} onClick={() => setValue(!value)} />
}
WithState.parameters = {
  controls: { hideNoControlsWarning: true },
}
