import { Layout } from '@/components/layout';
import Head from 'next/head';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { Data } from '@/pages/api/post/getPostByCatName';
import { request } from '@/components/server/utils/request';
import WebLink from '@/components/base/WebLink';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Container,
  Grid,
} from '@mui/material';

export default function Index({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{data?.catName}</title>
      </Head>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item={true} key={'cat_id'} sm={12} xs={12} lg={12} md={12}>
            <Card style={{ minHeight: '450px' }}>
              <CardContent>
                <Typography component={'h2'}>{data?.catName}</Typography>
                {data?.posts?.length &&
                  data?.posts.map((val, _index) => {
                    return (
                      <>
                        <List style={{ width: '100%' }} key={_index}>
                          <ListItem>
                            <WebLink
                              query={{ id: val.id }}
                              pathname="/blog/view/[id]"
                              link={{ underline: 'hover' }}
                            >
                              {val.title}
                            </WebLink>
                          </ListItem>
                        </List>
                      </>
                    );
                  })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

Index.Layout = Layout;
export const getServerSideProps: GetServerSideProps<{
  data?: Data;
  htmlContent?: string;
}> = async (context) => {
  const { id, page } = context.query;
  if (typeof id === 'string') {
    return request<Data>('/api/post/getPostByCatName', {
      method: 'post',
      data: { catName: id, page, size: 100 },
    })
      .then((res) => {
        return {
          props: {
            data: res || {},
          },
        };
      })
      .catch((e) => {
        console.log(e);
        return { notFound: true };
      });
  } else {
    return {
      notFound: true,
    };
  }
};
