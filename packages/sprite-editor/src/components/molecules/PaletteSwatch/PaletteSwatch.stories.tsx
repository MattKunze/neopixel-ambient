import { Meta, Story } from "@storybook/react"

import PaletteSwatch, { PaletteSwatchProps } from "./"

const PALETTE = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#4d908e",
  "#277da1",
]

export default {
  title: "Molecules/PaletteSwatch",
  component: PaletteSwatch,
  argTypes: {
    selectedColor: {
      control: {
        type: "inline-radio",
        options: PALETTE,
      },
    },
  },
} as Meta

const Template: Story<PaletteSwatchProps> = (props) => (
  <PaletteSwatch {...props} />
)

export const Defaults = Template.bind({})
Defaults.args = {
  colors: PALETTE,
}
