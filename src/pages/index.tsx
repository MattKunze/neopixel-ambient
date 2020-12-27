import { Box, Container, Typography } from "@material-ui/core"

import PixelGrid from "../components/molecules/PixelGrid"

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" gutterBottom>
          Something something
        </Typography>
        <PixelGrid />
      </Box>
    </Container>
  )
}
