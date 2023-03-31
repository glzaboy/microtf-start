import { Layout } from '@/components/layout';
import Head from 'next/head';
// import {
//   Grid,
//   List,
//   Card,
//   Space,
//   Modal,
//   Form,
//   Input,
//   Message,
//   Switch,
// } from '@arco-design/web-react';
import postLocale from '@/locale/post';
import formLocale from '@/locale/form';
import useLocale, { useLocaleName } from '@/components/utils/useLocale';
// import styles from '@/pages/admin/post/style/index.module.less';
import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@prisma/client';
import { requestMsg } from '@/components/server/utils/request';
import type { Data } from '@/pages/api/post/categories/list';
import AddIcon from '@mui/icons-material/Add';
// import cs from 'classnames';
import WebLink from '@/components/base/WebLink';
import type { Data as EditData } from '@/pages/api/post/categories/edit';
import {
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Button,
  TextField,
  ListItem,
  Pagination,
  DialogActions,
} from '@mui/material';
import { useFormik } from 'formik';

export default function Index() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const formik = useFormik<Category>({
    initialValues: {
      id: 0,
      cat: '',
      updatedAt: new Date(),
      createAt: new Date(),
      reqLogin: true,
    },
    onSubmit: (values) => {},
  });
  const postL = useLocale(postLocale);
  const formL = useLocale(formLocale);
  const lang = useLocaleName();
  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const fetchDataCallBack = useCallback(() => {
    const fetchData = (page: number, size: number) => {
      requestMsg<Data>('/api/post/categories/list', {
        method: 'post',
        data: { page, size },
        lang,
      }).then((res) => {
        setData(res.categories || []);
        setTotal(res.total || 0);
      });
    };
    if (page > 0) {
      fetchData(page, 10);
    }
  }, [lang, page]);
  useEffect(() => {
    setPage(1);
  }, []);
  useEffect(() => {
    fetchDataCallBack();
  }, [fetchDataCallBack]);
  // const [form] = Form.useForm();
  const editForm = (item: Category) => {
    // form.setFieldsValue(item);
    formik.setValues(item);
    console.log(item);
    setVisible(true);
  };
  const handleOk = () => {
    form
      .validate()
      .then((values) => {
        requestMsg<EditData>('/api/post/categories/edit', {
          method: 'post',
          data: values,
        }).then((data) => {
          console.log(data);
          Message.info('操作成功');
          setVisible(false);
          fetchDataCallBack();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleDelete = (id: number) => {
    requestMsg<EditData>('/api/post/categories/delete', {
      method: 'post',
      data: { id },
    })
      .then((data) => {
        console.log(data);
        Message.info('操作成功');
        setVisible(false);
        fetchDataCallBack();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{postL['post.category.title']}</title>
      </Head>
      <Dialog open={visible}>
        <DialogTitle>{postL['post.edit.Title']}</DialogTitle>
        <DialogContent>
          <form>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="cat"
                id="cat"
                label={postL['post.category.field.name']}
                placeholder={postL['post.category.field.name']}
                fullWidth
                value={formik.values.cat}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="reqLogin"
                id="reqLogin"
                label={postL['post.category.reqLogin']}
                fullWidth
                value={formik.values.reqLogin}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="createAt"
                id="createAt"
                label={formL['createTime']}
                fullWidth
                value={formik.values.createAt}
              ></TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                variant={'standard'}
                name="updatedAt"
                id="updatedAt"
                label={formL['updateTime']}
                placeholder={formL['updateTime']}
                fullWidth
                value={formik.values.updatedAt}
              ></TextField>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisible(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
      <Card>
        <Grid>
          <Grid item={true} xs={12}>
            <WebLink
              handleClick={() =>
                editForm({
                  reqLogin: false,
                  cat: '',
                  id: 0,
                  createAt: new Date(),
                  updatedAt: new Date(),
                })
              }
            >
              <AddIcon />
              {formL['new']}
            </WebLink>
          </Grid>
          <Grid item={true} md={24} xs={24} sm={24}>
            <Card>
              <List>
                {data &&
                  data.map((item) => (
                    <ListItem>
                      {item.cat}
                      <WebLink
                        pathname="/post/category/edit/"
                        handleClick={() => {
                          editForm(item);
                        }}
                      >
                        {formL['edit']}
                      </WebLink>{' '}
                      <WebLink
                        confirmText={formL['delete.confirm']}
                        handleClick={() => {
                          handleDelete(item.id);
                        }}
                      >
                        {formL['delete']}
                      </WebLink>
                    </ListItem>
                  ))}
              </List>
              <Pagination
                count={total}
                page={page}
                onChange={(e, page) => {
                  setPage(page);
                }}
              ></Pagination>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
Index.Layout = Layout;
