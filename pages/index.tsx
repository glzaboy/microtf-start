import Head from 'next/head';
import { Container, Box, Button } from '@mui/material';
import { useAppSelector, selectLayout } from '@/modules/store';
import { requestMsg } from '@/components/server/utils/request';
import Message2 from '@/components/base/Message';

export default function Home() {
  const globalState = useAppSelector(selectLayout);
  return (
    <>
      <Head>
        <title>第一个页面</title>
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ m: 3 }}>
          {globalState.layout}
          {globalState.layout}
        </Box>
        <Button
          onClick={() => {
            requestMsg('http://baidu.com');
          }}
        >
          t
        </Button>
        <Message2></Message2>
      </Container>
    </>
  );
}
