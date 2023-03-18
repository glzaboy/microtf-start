import Head from 'next/head';
import { Container, Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <>
      <Head>
        <title>第一个页面</title>
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Material UI - Next.js example
          </Typography>
          {/* <Link href="/about" color="secondary">
            Go to the about page
          </Link> */}
          {/* <ProTip /> */}
          {/* <Copyright /> */}
        </Box>
      </Container>
    </>
  );
}
