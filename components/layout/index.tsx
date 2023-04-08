import { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';
import HeaderNav from './headerNav';
import { Drawer, ListItem, List } from '@mui/material';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
export default DefaultLayout;

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
export const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HeaderNav />
      {children}
      <Footer />
    </>
  );
};
