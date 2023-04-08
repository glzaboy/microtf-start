import { AdminLayout } from '@/components/layout';
import Head from 'next/head';
import postLocale from '@/locale/post';
import formLocale from '@/locale/form';
import useLocale, { useLocaleName } from '@/components/utils/useLocale';
import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@prisma/client';
import { requestMsg } from '@/components/server/utils/request';
import type { Data } from '@/pages/api/post/categories/list';
import AddIcon from '@mui/icons-material/Add';
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
  Container,
  Button,
  TextField,
  ListItem,
  Stack,
  DialogActions,
  Switch,
  TablePagination,
  Box,
  FormControlLabel,
  Typography,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';

export default function Index() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const formIk = useFormik<Category>({
    initialValues: {
      id: 0,
      cat: '',
      updatedAt: new Date(),
      createAt: new Date(),
      reqLogin: true,
    },
    onSubmit: (values) => {
      requestMsg<EditData>('/api/post/categories/edit', {
        method: 'post',
        data: values,
      }).then(() => {
        setVisible(false);
        fetchDataCallBack();
      });
    },
  });
  const postL = useLocale(postLocale);
  const formL = useLocale(formLocale);
  const lang = useLocaleName();
  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fetchDataCallBack = useCallback(() => {
    const fetchData = (page: number, size: number) => {
      requestMsg<Data>('/api/post/categories/list', {
        method: 'post',
        data: { page, size },
        lang,
      }).then((res) => {
        setData(res.categories || []);
        setTotal(res.total || 0);
        console.log(res.total || 0);
        console.log(Math.round((res.total || 0) / 5));
      });
    };
    if (page >= 0) {
      fetchData(page + 1, rowsPerPage);
    }
  }, [lang, page, rowsPerPage]);
  useEffect(() => {
    setPage(0);
  }, []);
  useEffect(() => {
    fetchDataCallBack();
  }, [fetchDataCallBack]);
  const editForm = (item: Category) => {
    formIk.setValues(item);
    console.log(item);
    setVisible(true);
  };
  const handleDelete = (id: number) => {
    requestMsg<EditData>('/api/post/categories/delete', {
      method: 'post',
      data: { id },
    })
      .then((data) => {
        console.log(data);
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
      <Dialog open={visible} sx={{ width: 1, p: 1 }}>
        <DialogTitle>{postL['post.edit.Title']}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <form onSubmit={formIk.handleSubmit}>
              <FormControl fullWidth>
                <TextField
                  variant={'standard'}
                  name="cat"
                  id="cat"
                  label={postL['post.category.field.name']}
                  placeholder={postL['post.category.field.name']}
                  fullWidth
                  value={formIk.values.cat}
                  onChange={(e) => formIk.handleChange(e)}
                ></TextField>
              </FormControl>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      name="reqLogin"
                      id="reqLogin"
                      checked={formIk.values.reqLogin}
                      onChange={(e) => formIk.handleChange(e)}
                    />
                  }
                  label={postL['post.category.reqLogin']}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  variant={'standard'}
                  name="createAt"
                  id="createAt"
                  label={formL['createTime']}
                  fullWidth
                  value={formIk.values.createAt}
                  disabled
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
                  onChange={(e) => formIk.handleChange(e)}
                  disabled
                  value={formIk.values.updatedAt}
                ></TextField>
              </FormControl>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisible(false)} color={'secondary'}>
            关闭
          </Button>
          <Button
            variant="text"
            onClick={() => formIk.handleSubmit()}
            color={'primary'}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="xl">
        <Card>
          <Grid>
            <Grid item={true} xs={12}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={0.5}
                sx={{ m: 2 }}
              >
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
              </Stack>
            </Grid>
            <Grid item={true} md={12} xs={12} sm={12}>
              <Card>
                <List>
                  {data &&
                    data.map((item) => (
                      <ListItem key={item.id}>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Typography>{item.cat}</Typography>
                          <Paper>
                            <WebLink
                              pathname="/post/category/edit/"
                              handleClick={() => {
                                editForm(item);
                              }}
                            >
                              {formL['edit']}
                            </WebLink>
                          </Paper>
                          <Paper>
                            <WebLink
                              confirmText={formL['delete.confirm']}
                              handleClick={() => {
                                handleDelete(item.id);
                              }}
                              link={{ underline: 'none' }}
                            >
                              {formL['delete']}
                            </WebLink>
                          </Paper>
                        </Stack>
                      </ListItem>
                    ))}
                </List>
                <TablePagination
                  component="div"
                  count={total}
                  page={page}
                  onPageChange={(e, page) => {
                    setPage(page);
                  }}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
Index.Layout = AdminLayout;
