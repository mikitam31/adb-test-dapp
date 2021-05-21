import {
  Container, Box, Typography, Button
} from '@material-ui/core'

const Home = () => (
  <Container maxWidth="sm">
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js example
      </Typography>

      <Button variant="contained" color="primary">Hello World</Button>
    </Box>
  </Container>
)

export default Home
