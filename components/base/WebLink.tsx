import Link from 'next/link';
import {
  Link as MuiLink,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogContentText,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { ParsedUrlQueryInput } from 'node:querystring';
import type { LinkProps } from '@mui/material';
import { useRouter } from 'next/router';

const WebLink = ({
  confirmText,
  link,
  children,
  pathname,
  query,
  handleClick,
}: {
  children: ReactNode;
  pathname?: string;
  query?: string | null | ParsedUrlQueryInput | undefined;
  handleClick?: () => void;
  confirmText?: string;
  link?: LinkProps;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  if (confirmText) {
    return (
      <>
        <MuiLink
          {...link}
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          {children}
        </MuiLink>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>{confirmText}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color={'secondary'}>
              取消
            </Button>
            <Button
              onClick={() => {
                if (handleClick) {
                  handleClick();
                }
                if (pathname) {
                  router.push({
                    pathname: pathname,
                    query: query,
                  });
                }
              }}
              autoFocus
              color={'warning'}
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else if (
    handleClick !== undefined &&
    typeof handleClick === 'function' &&
    !confirmText
  ) {
    return (
      <MuiLink
        {...link}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        component="span"
        style={{ cursor: 'pointer' }}
      >
        {children}
      </MuiLink>
    );
  } else if (pathname) {
    return (
      <Link
        href={{
          pathname,
          query,
        }}
        style={{ color: 'unset', textDecoration: 'none', cursor: 'pointer' }}
      >
        <MuiLink {...link} component="span">
          {children}
        </MuiLink>
      </Link>
    );
  } else {
    return <>{children}</>;
  }
};
export default WebLink;
