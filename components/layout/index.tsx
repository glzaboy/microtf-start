import { ReactNode } from 'react';
import Footer from './footer';
import Header from './header';

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
