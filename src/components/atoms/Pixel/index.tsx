import { Box } from "@material-ui/core"

interface Props {
  color: string
}
export default function Pixel(props: Props) {
  return (
    <Box flex={1} bgcolor={props.color} padding={2}>
      {props.color}
    </Box>
  )
}
