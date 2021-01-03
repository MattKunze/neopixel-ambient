import { useState } from "react"
import { Meta, Story } from "@storybook/react"

import { PaletteColor } from "types"
import Slider, { SliderProps } from "./"

export default {
  title: "Atoms/Slider",
  component: Slider,
  argTypes: {
    color: {
      control: {
        type: "inline-radio",
        options: Object.values(PaletteColor),
      },
    },
  },
} as Meta

const Template: Story<SliderProps> = (props) => <Slider {...props} />

export const Defaults = Template.bind({})
Defaults.args = {
  color: PaletteColor.Pink,
  value: 0,
  range: {
    min: 0,
    max: 10,
  },
}

export const WithState = () => {
  const [value, setValue] = useState(0)
  return (
    <Slider value={value} range={{ min: 0, max: 10 }} onChange={setValue} />
  )
}
WithState.parameters = {
  controls: { hideNoControlsWarning: true },
}

export const MultipleValues = () => {
  const [first, setFirst] = useState(0)
  const [second, setSecond] = useState(0)
  const [third, setThird] = useState(0)

  return (
    <>
      <Slider
        color={PaletteColor.Red}
        value={first}
        range={{ min: 0, max: 10 }}
        onChange={setFirst}
      />
      <Slider
        color={PaletteColor.Green}
        value={second}
        range={{ min: 0, max: 50 }}
        onChange={setSecond}
      />
      <Slider
        color={PaletteColor.Blue}
        value={third}
        range={{ min: 0, max: 100 }}
        onChange={setThird}
      />
    </>
  )
}
WithState.parameters = {
  controls: { hideNoControlsWarning: true },
}
