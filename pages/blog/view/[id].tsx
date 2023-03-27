import Head from 'next/head';
import { Layout } from '@/components/layout';
import { Container, Card, Typography, CardContent } from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { request } from '@/components/server/utils/request';

import type { Data } from '@/pages/api/post/get';
import Prism from 'prismjs';
import pri from 'prismjs/components/index.js';
import { JSDOM } from 'jsdom';
import 'prismjs/themes/prism.css';

export default function Home({
  data,
  htmlContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Typography>{data?.title}</Typography>
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent ?? '无内容' }}
            ></div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
Home.Layout = Layout;
export const getServerSideProps: GetServerSideProps<{
  data?: Data;
  htmlContent?: string;
}> = async (context) => {
  // Fetch data from external API
  if (typeof context.query.id === 'string') {
    const id: number = parseInt(context.query.id || '0');
    return request<Data>('/api/post/get', {
      method: 'get',
      params: { id },
    })
      .then((res) => {
        pri([
          'css',
          'markup',
          'xml-doc',
          'javascript',
          'typescript',
          'jsx',
          'go',
          'php',
          'c',
          'python',
          'java',
          'cpp',
          'csharp',
          'vbnet',
          'sql',
          'ruby',
          'swift',
          'bash',
          'lua',
          'groovy',
          'markdown',
        ]);
        const jsdom = new JSDOM(res.content || '');
        Prism.highlightAllUnder(jsdom.window.document.body, false);
        return {
          props: {
            data: res || {},
            htmlContent: jsdom.window.document.body.innerHTML,
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
