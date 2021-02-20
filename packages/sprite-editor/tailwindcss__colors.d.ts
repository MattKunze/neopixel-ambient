declare module "tailwindcss/colors" {
  declare type ColorName =
    | "amber"
    | "blue"
    | "blueGray"
    | "coolGray"
    | "cyan"
    | "emerald"
    | "fuchsia"
    | "gray"
    | "green"
    | "indigo"
    | "lightBlue"
    | "lime"
    | "orange"
    | "pink"
    | "purple"
    | "red"
    | "rose"
    | "teal"
    | "trueGray"
    | "violet"
    | "warmGray"
    | "yellow"

  declare type ColorIntensity =
    | "50"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"

  export { ColorName, ColorIntensity }

  declare type ColorRange = Record<ColorIntensity, string>

  declare type Theme = Record<ColorName, ColorRange>

  declare const colors: Theme
  export default colors
}
