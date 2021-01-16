import { createElement, ReactNode } from "react"
import { Meta, Story } from "@storybook/react"
import * as HeroIcons from "heroicons-react"

import { PaletteColor } from "types"
import Button, { ButtonProps } from "./"

export default {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    color: {
      control: {
        type: "inline-radio",
        options: Object.values(PaletteColor),
      },
    },
    icon: {
      control: {
        type: "select",
        options: Object.keys(HeroIcons).filter((t) => t.endsWith("Outline")),
      },
    },
  },
} as Meta

// encapsulate type conversion garbage here - prop type is `ReactNode` but
// we edit the control as a string
const renderIcon = (icon: unknown) =>
  createElement(HeroIcons[icon as keyof typeof HeroIcons])

const Template: Story<ButtonProps> = ({ icon, ...props }) => (
  <Button {...props} icon={icon ? renderIcon(icon) : undefined} />
)

export const WithText = Template.bind({})
WithText.args = {
  text: "Howdy",
  color: PaletteColor.Green,
}
WithText.argTypes = {
  icon: { table: { disable: true } },
  rightIcon: { table: { disable: true } },
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  text: "Howdy",
  icon: "SparklesOutline",
  color: PaletteColor.Pink,
}
