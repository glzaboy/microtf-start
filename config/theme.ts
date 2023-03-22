import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { green, red } from '@mui/material/colors';

export const roboto2 = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});
// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#786800',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto2.style.fontFamily,
  },
});

export default theme;
