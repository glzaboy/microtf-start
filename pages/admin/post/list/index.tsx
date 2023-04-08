import { AdminLayout } from '@/components/layout';
import Head from 'next/head';
import {
  Grid,
  List,
  ListItem,
  Card,
  CardContent,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Stack,
  Container,
} from '@mui/material';
import formLocale from '@/locale/form';
import postLocale from '@/locale/post';
import useLocale, { useLocaleName } from '@/components/utils/useLocale';
import { useCallback, useEffect, useState } from 'react';
import type { Post, Category } from '@prisma/client';
import { requestMsg } from '@/components/server/utils/request';
import type { Data } from '@/pages/api/post/list';
import AddIcon from '@mui/icons-material/Add';
import WebLink from '@/components/base/WebLink';
import type { Data as CatData } from '@/pages/api/post/categories/list';
import type { SelectChangeEvent } from '@mui/material';

export default function Index() {
  const postL = useLocale(postLocale);
  const formL = useLocale(formLocale);
  const lang = useLocaleName();
  const [data, setData] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [catId, setCatId] = useState<number>(0);

  const fetchCatCallBack = useCallback(() => {
    const fetchCatData = (page: number, size: number) => {
      requestMsg<CatData>('/api/post/categories/list', {
        method: 'post',
        data: { page, size, catId: 1 },
        lang,
      }).then((res) => {
        setCategories(res.categories || []);
      });
    };
    fetchCatData(1, 100);
  }, [lang]);

  const fetchDataCallBack = useCallback(() => {
    const fetchData = (page: number, size: number, catId: number) => {
      requestMsg<Data>('/api/post/list', {
        method: 'post',
        data: { page, size, catId },
        lang,
      }).then((res) => {
        setData(res.post || []);
        setTotal(res.total || 0);
      });
    };
    if (page > 0) {
      fetchData(page, 10, catId);
    }
  }, [page, catId, lang]);
  useEffect(() => {
    fetchCatCallBack();
  }, [fetchCatCallBack]);
  useEffect(() => {
    fetchDataCallBack();
  }, [fetchDataCallBack]);
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico"
        />
        <title>{postL['post.list']}</title>
      </Head>
      <Container maxWidth="xl">
        <Card>
          <Grid>
            <Grid item={true} xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="cat_select">Age</InputLabel>
                <Select
                  // label={postL['post.list.catSel']}
                  id="cat_select"
                  label="Age"
                  placeholder={postL['post.list.catSel']}
                  onChange={(event: SelectChangeEvent) => {
                    console.log(event);
                    setCatId(parseInt(event.target.value));
                    setPage(1);
                  }}
                  variant="standard"
                >
                  {categories &&
                    categories.map((value) => {
                      return (
                        <MenuItem value={value.id} key={value.id}>
                          {value.cat}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <WebLink pathname="/admin/post/edit/0">
                <AddIcon />
                {formL['new']}
              </WebLink>
            </Grid>
            <Grid item={true} xs={12}>
              <Card>
                <CardContent>
                  <List>
                    {data &&
                      data.map((item, index) => (
                        <ListItem key={index}>
                          <Stack direction={'row'}>
                            {item.title}
                            <WebLink
                              pathname="/admin/post/edit/[id]"
                              query={{ id: item.id }}
                            >
                              {formL['edit']}
                            </WebLink>
                            <WebLink
                              confirmText={formL['delete.confirm']}
                              handleClick={() => {
                                requestMsg<Data>('/api/post/delete', {
                                  method: 'post',
                                  data: { id: item.id },
                                });
                              }}
                            >
                              {formL['delete']}
                            </WebLink>
                          </Stack>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
Index.Layout = AdminLayout;
