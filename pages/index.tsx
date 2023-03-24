import Head from 'next/head';
import { Container, Box, Button } from '@mui/material';
import { useAppSelector, selectLayout } from '@/modules/store';

import message from '@/components/base/Message';
import { styled } from '@mui/system';
const BK = styled(
  'div',
  {}
)({
  background: 'red',
  textAlign: 'center',
  '& .MuiButtonBase-root': {
    display: 'none',
  },
});

export default function Home() {
  const globalState = useAppSelector(selectLayout);
  return (
    <>
      <Head>
        <title>第一个页面</title>
      </Head>
      <Container maxWidth="lg">
        <Box sx={{ m: 3 }}>{globalState.layout}</Box>
        <Button
          onClick={() => {
            message.info('hello');
            message.success('hello222');
          }}
        >
          消息
        </Button>
        <Button
          onClick={() => {
            message.warn(
              <>
                <Button>22</Button>
              </>
            );
          }}
        >
          消息2
        </Button>
        <BK>
          test
          <div>
            <Button>abc</Button>
          </div>
        </BK>
      </Container>
    </>
  );
}
