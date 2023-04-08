import Head from 'next/head';
import { Layout } from '@/components/layout';
import {
  Container,
  Card,
  Grid,
  Button,
  CardContent,
  CardActions,
  FormControl,
  TextField,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { requestMsg } from '@/components/server/utils/request';
import { useFormik } from 'formik';
import message from '@/components/base/Message';
import * as yup from 'yup';
import type { response } from '@/components/server/dto/response';
import { useRouter } from 'next/router';
import getImage from '@/components/server/bingImage';

export default function Login({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const validationSchema = yup.object({
    name: yup.string().required('用户名不能为空'),
    password: yup.string().required('密码不能为空'),
  });
  const formik = useFormik<{
    name: string;
    password: string;
    loginType: string;
  }>({
    initialValues: { name: '', password: '', loginType: 'PASSWORD' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      requestMsg<response>('/api/login', { method: 'post', data: values })
        .then(() => {
          router.push('/admin/post/list');
        })
        .catch((err) => {
          message.error(err);
        })
        .finally(() => {
          //   setLoading(false);
        });
    },
  });
  return (
    <>
      <Head>
        <title>{'登录'}</title>
      </Head>
      <Container
        maxWidth="xl"
        sx={{
          minHeight: matches ? 0 : 650,
          backgroundImage: matches ? null : "url('" + data.background + "')",
        }}
      >
        <Grid container spacing={2}>
          <Grid item={true} xs={12}>
            <Box
              sx={{
                '& > :not(style)': {
                  m: 1,
                },
                width: matches ? 1 : 0.5,
              }}
            >
              <Card>
                <CardContent>
                  <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ display: 'none' }}>
                      <FormControl>
                        <TextField
                          fullWidth
                          id="loginType"
                          name="loginType"
                          label="用户名"
                          required
                          value={formik.values.loginType}
                          variant="standard"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          error={
                            formik.touched.loginType &&
                            Boolean(formik.errors.loginType)
                          }
                          helperText={
                            formik.touched.loginType && formik.errors.loginType
                          }
                        />
                      </FormControl>
                    </Box>
                    <FormControl fullWidth sx={{ p: 2 }}>
                      <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="用户名"
                        required
                        value={formik.values.name}
                        variant="standard"
                        placeholder="请输入用户名"
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                      />
                    </FormControl>
                    <FormControl fullWidth variant="standard" sx={{ p: 2 }}>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="密码"
                        type={'password'}
                        variant="standard"
                        placeholder="请输入密码"
                        value={formik.values.password}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        helperText={
                          formik.touched.password && formik.errors.password
                        }
                      />
                    </FormControl>
                  </form>
                </CardContent>
                <CardActions sx={{ textAlign: 'right' }}>
                  <Button
                    type="submit"
                    onClick={() => {
                      formik.submitForm();
                    }}
                    fullWidth
                  >
                    登录
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      message.info('请直接联系站长');
                    }}
                    fullWidth
                  >
                    注册
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
Login.Layout = Layout;
export const getServerSideProps: GetServerSideProps<{
  data: { background: string };
}> = async () => {
  const a = await getImage();
  return { props: { data: { background: a } } };
};
