import Head from 'next/head';
import { Layout } from '@/components/layout';
import {
  Container,
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  CardContent,
} from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { Data as ApiCategoryList } from '@/pages/api/post/getCat';
import { request } from '@/components/server/utils/request';
import WebLink from '@/components/base/WebLink';

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log(data.categories);
  return (
    <>
      <Head>
        <title>{'microtf'}</title>
      </Head>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {data.categories &&
            data.categories.map((value) => {
              return (
                <Grid item={true} key={value.id} sm={6} xs={12} lg={4} md={4}>
                  <Card>
                    <CardContent>
                      <Typography>
                        <WebLink
                          pathname="/blog/category/[id]/[page]"
                          query={{ id: value.cat, page: 1 }}
                          link={{ underline: 'hover' }}
                        >
                          {value.cat}
                        </WebLink>
                      </Typography>
                      <List>
                        {value.posts.map((post) => {
                          return (
                            <ListItem key={post.post.id}>
                              <WebLink
                                query={{ id: post.post.id }}
                                pathname="/blog/view/[id]"
                                link={{
                                  underline: 'hover',
                                }}
                              >
                                {post.post.title}
                              </WebLink>
                            </ListItem>
                          );
                        })}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}
Home.Layout = Layout;
export const getServerSideProps: GetServerSideProps<{
  data: ApiCategoryList;
}> = async (context) => {
  return request<ApiCategoryList>('/api/post/getCat', {
    method: 'post',
    withCookie: context.req.cookies,
  })
    .then((result) => {
      return { props: { data: { ...result } } };
    })
    .catch((err) => {
      console.error(err);
      return { notFound: true };
    });
};
