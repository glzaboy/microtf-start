import { Alert } from '@mui/material';
import styled from '@emotion/styled';
import { ThemeProvider } from '@mui/material/styles';

import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import theme from '@/config/theme';

const MessageContainer = styled('div')(() => ({
  width: '100%',
  position: 'fixed',
  zIndex: 3000,
  padding: '0 10px',
  textAlign: 'center',
  pointerEvents: 'none',
  boxSizing: 'border-box',
  left: 0,
  top: 0,
  '& .MuiPaper-root': {
    width: '50%',
    margin: '2px auto',
    pointerEvents: 'auto',
  },
}));

// Message 组件
function Message(props: messageQueueItem) {
  const { type, message, id } = props;
  return (
    <Alert
      severity={type}
      onClose={() => {
        removeMessage(id);
      }}
      style={{ width: '50%' }}
    >
      {message}
    </Alert>
  );
}

const CONTAINER_ID = 'global_message';

type messageType = 'success' | 'info' | 'warning' | 'error';
type messageInput = (message: string | ReactNode) => void;
interface messageOption {
  type?: messageType;
  message: string | ReactNode;
}
interface messageQueueItem extends messageOption {
  id: string;
}
interface propsMessage {
  info: messageInput;
  warn: messageInput;
  error: messageInput;
  success: messageInput;
}

export type { propsMessage, messageOption, messageQueueItem };
function uuid() {
  const uuid = window.crypto.getRandomValues(new Uint8Array(8));

  return uuid.toString().split(',').join('');
}
const messageQueue: Array<messageQueueItem> = [];
// 新增消息
function addMessage(params: messageOption) {
  const id = uuid();
  messageQueue.push({ ...params, id });
  setTimeout(() => {
    removeMessage(id);
  }, 3000);
  renderMessage([...messageQueue]);
}

// 移除消息
function removeMessage(id: string) {
  const position = messageQueue.findIndex((item) => item.id === id);
  messageQueue.splice(position, 1);
  renderMessage([...messageQueue]);
}
let containerRoot: Root;
function renderMessage(messageQueue: Array<messageQueueItem>) {
  const container = createContainer();
  if (!containerRoot) {
    containerRoot = createRoot(container);
  }

  const MessageComponents = messageQueue.map((props) => {
    return <Message {...props} key={props.id} />;
  });
  const MessageRender = (
    <ThemeProvider theme={theme}>
      <MessageContainer>{MessageComponents}</MessageContainer>
    </ThemeProvider>
  );
  containerRoot.render(MessageRender);
}
function createContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', CONTAINER_ID);
    document.body.appendChild(container);
  }
  return container;
}
const api: propsMessage = {
  info: (message: string | ReactNode) => addMessage({ type: 'info', message }),
  warn: (message: string | ReactNode) =>
    addMessage({ type: 'warning', message }),
  error: (message: string | ReactNode) =>
    addMessage({ type: 'error', message }),
  success: (message: string | ReactNode) =>
    addMessage({ type: 'success', message }),
};

export default api;
