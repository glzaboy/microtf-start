import { Alert, Popover } from '@mui/material';
import styled from '@emotion/styled';

import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import theme from '@/config/theme';
import { ThemeProvider } from '@mui/material/styles';

const GlobalProver = styled(Popover)(() => ({
  '.MuiPopover-root': {
    position: 'unset',
    display: 'none',
  },
}));
let root: Root;
function notice(args: msgType) {
  const div = document.getElementById('global');
  if (!div) {
    const div2 = document.createElement('div');
    div2.setAttribute('id', 'global');
    document.body.appendChild(div2);
    root = createRoot(div2);
  } else {
  }
  root.render(<Message {...args} />);
}
let timer: NodeJS.Timeout;
type msgType = {
  message: ReactNode;
  severity?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
};
function Message(props: msgType) {
  const [msgs, setMsgs] = useState<Array<msgType>>([]);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    setMsgs([...msgs, props]);
  }, [props]);
  useEffect(() => {
    if (msgs.length) {
      setOpen(true);
      const msgs_copy = JSON.parse(JSON.stringify(msgs));

      clearInterval(timer);
      timer = setInterval(
        (setMsgs1) => {
          msgs_copy.shift();
          setMsgs1(JSON.parse(JSON.stringify(msgs_copy)));
          if (!msgs_copy.length) {
            clearInterval(timer);
          }
        },
        2 * 1000,
        setMsgs
      );
    } else {
      setOpen(false);
    }
    console.log(msgs);
  }, [msgs, props]);
  return (
    <>
      {msgs && (
        <ThemeProvider theme={theme}>
          <GlobalProver
            style={{ position: 'unset' }}
            open={open}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
          >
            {msgs.map((item, index) => {
              return (
                <Alert
                  severity={item.severity}
                  sx={{ m: 0, width: '100%', boxShadow: 1 }}
                  key={index}
                >
                  {item.message}
                  {item.severity}
                </Alert>
              );
            })}
          </GlobalProver>
        </ThemeProvider>
      )}
    </>
  );
}
const api = {
  info: (args: msgType): void => {
    args.severity = 'info';
    args.duration = args.duration ?? 3;
    console.log(args);
    return notice(args);
  },
  error: (args: msgType): void => {
    args.severity = 'error';
    args.duration = args.duration ?? 3;
    console.log(args);
    return notice(args);
  },
  warn: (args: msgType): void => {
    args.severity = 'warning';
    args.duration = args.duration ?? 3;
    console.log(args);
    return notice(args);
  },
  success: (args: msgType): void => {
    args.severity = 'success';
    args.duration = args.duration ?? 3;
    console.log(args);
    return notice(args);
  },
};
export default api;
