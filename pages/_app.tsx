import '@/styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import theme from '@/config/theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { Provider } from 'react-redux';
import store from '@/modules/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </Provider>
  );
}
