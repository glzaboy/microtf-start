import Head from 'next/head';
import { Layout } from '@/components/layout';
import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  TextField,
  FormControl,
  Container,
} from '@mui/material';
import { useFormik } from 'formik';
import WebLink from '@/components/base/WebLink';
import { requestMsg } from '@/components/server/utils/request';
import formLocale from '@/locale/form';
import postLocale from '@/locale/post';
import useLocale, { useLocaleName } from '@/components/utils/useLocale';

const DynamicEditor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
});
import { useRouter } from 'next/router';
import { Data as PostData } from '@/pages/api/post/get';
import { Data as EditData, InputDate } from '@/pages/api/post/edit';
import CategorySelect from '@/components/CategorySelect';

export default function Index() {
  const router = useRouter();
  const formL = useLocale(formLocale);
  const postL = useLocale(postLocale);
  const lang = useLocaleName();

  const [html, setHtml] = useState<string>('');
  const [id, setId] = useState<number>(0);
  const formIk = useFormik<InputDate>({
    initialValues: {
      id: 0,
      categoryId: [],
      content: '',
      title: '',
    },
    onSubmit: (values) => {
      requestMsg<EditData>('/api/post/edit', {
        method: 'post',
        data: values,
      }).then((res) => {
        if (id === 0) {
          setId(res.id);
        }
      });
    },
  });

  useEffect(() => {
    if (id <= 0) {
      return;
    }
    requestMsg<PostData>('/api/post/get', {
      method: 'get',
      params: { id },
      lang,
    }).then((res) => {
      formIk.setFieldValue('id', res.id);
      formIk.setFieldValue('title', res.title);
      formIk.setFieldValue('content', res.content);
      setHtml(res.content ?? '');
      const catMap: number[] = [];
      res.categories?.forEach((item) => {
        catMap.push(item.categoryId);
      });
      formIk.setFieldValue('categoryId', catMap);
    });
  }, [id, lang]);
  useEffect(() => {
    const { id: queryId } = router.query;
    if (typeof queryId != 'string') {
      return;
    }
    if (parseInt(queryId) <= 0) {
      return;
    }
    setId(parseInt(queryId));
  }, [router.query]);
  function onSubmitClick() {
    formIk.setFieldValue('content', html);
    formIk.handleSubmit();
  }
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
      </Head>
      <Container maxWidth="xl">
        <Card>
          <form onSubmit={formIk.handleSubmit}>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="id"
                id="id"
                label={postL['post.category.field.name']}
                placeholder={postL['post.category.field.name']}
                fullWidth
                value={formIk.values.id}
                onChange={(e) => formIk.handleChange(e)}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="title"
                id="title"
                label={postL['post.title']}
                placeholder={postL['post.title']}
                fullWidth
                value={formIk.values.title}
                onChange={(e) => formIk.handleChange(e)}
              ></TextField>
            </FormControl>
            <FormControl>
              <CategorySelect
                selectedVlues={[16, 14]}
                onClose={() => {}}
              ></CategorySelect>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="content"
                id="content"
                fullWidth
                value={formIk.values.content}
                onChange={(e) => formIk.handleChange(e)}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <DynamicEditor
                html={html}
                setHtml={setHtml}
                lang={lang}
              ></DynamicEditor>
            </FormControl>
          </form>
          <CardActions>
            <Button color="primary" variant={'text'} onClick={onSubmitClick}>
              {formL['save']}
            </Button>
            <WebLink
              handleClick={() => {
                router.push({
                  pathname: '/admin/post/list',
                });
              }}
              confirmText={formL['confirm']}
              link={{ underline: 'none', variant: 'button' }}
            >
              {formL['back']}
            </WebLink>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
Index.Layout = Layout;
