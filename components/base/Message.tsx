import { Snackbar, SnackbarContent, Alert, Popover } from '@mui/material';

import { ReactNode } from 'react';

type Props<T extends (...args: any) => any> = Parameters<T>[0];
export type TableProps = Props<typeof Snackbar.arguments[0]>;
export default function Message() {
  const message: Array<{
    message: ReactNode;
    open: boolean;
    severity?: 'success' | 'info' | 'warning' | 'error';
  }> = [
    { message: 'acddfad', open: true },
    { message: 'ac', open: true },
  ];
  console.log(message);
  return (
    <>
      {message.map((_item) => (
        <Popover
          open={true}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ width: '100%' }}
          key={_item.message?.toString()}
        >
          <Alert severity="success" sx={{ m: 0, width: '100%', boxShadow: 1 }}>
            {_item.message}
          </Alert>
        </Popover>
      ))}
    </>
  );
}
