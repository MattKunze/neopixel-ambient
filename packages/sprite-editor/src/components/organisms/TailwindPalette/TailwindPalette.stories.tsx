import { Meta, Story } from "@storybook/react"
import { ColorName } from "tailwindcss/colors"

import TailwindPalette, { ColorRangeProps, SwatchProps } from "./"
import { PaletteColor } from "types"

export default {
  title: "Organisms/TailwindPalette",
  component: TailwindPalette,
} as Meta

const DisabledControl = {
  table: { disable: true },
}
const ColorRadioControl = {
  control: {
    type: "inline-radio",
    options: Object.values(PaletteColor),
  },
}
const ColorSelectControl = {
  control: {
    type: "select",
    options: Object.values(PaletteColor),
  },
}
const IntensityControl = {
  control: {
    type: "inline-radio",
    options: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ],
  },
}

const ColorTemplate: Story<ColorRangeProps> = (props) => (
  <TailwindPalette {...props} />
)

export const Defaults = ColorTemplate.bind({})
Defaults.args = {
  color: PaletteColor.Green,
}
Defaults.argTypes = {
  color: ColorRadioControl,
  colors: DisabledControl,
  intensity: DisabledControl,
  selectedColor: DisabledControl,
}

interface SwatchStoryProps extends SwatchProps {
  color1: ColorName
  color2: ColorName
  color3: ColorName
  color4: ColorName
  color5: ColorName
  color6: ColorName
  color7: ColorName
  color8: ColorName
}
const SwatchTemplate: Story<SwatchStoryProps> = (props) => {
  const colors = [
    props.color1,
    props.color2,
    props.color3,
    props.color4,
    props.color5,
    props.color6,
    props.color7,
    props.color8,
  ]
  return <TailwindPalette {...props} colors={colors} />
}
export const Swatch = SwatchTemplate.bind({})
Swatch.args = {
  color1: "red",
  color2: "orange",
  color3: "yellow",
  color4: "lime",
  color5: "green",
  color6: "cyan",
  color7: "blue",
  color8: "purple",
  intensity: "900",
  colors: [],
}
Swatch.argTypes = {
  intensity: IntensityControl,
  color1: ColorSelectControl,
  color2: ColorSelectControl,
  color3: ColorSelectControl,
  color4: ColorSelectControl,
  color5: ColorSelectControl,
  color6: ColorSelectControl,
  color7: ColorSelectControl,
  color8: ColorSelectControl,
  color: DisabledControl,
  colors: DisabledControl,
  selectedColor: DisabledControl,
}
