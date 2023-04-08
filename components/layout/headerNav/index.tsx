import {
  IconButton,
  Toolbar,
  Button,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import logo from '@/public/logo.svg';
import AppsIcon from '@mui/icons-material/Apps';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Image from 'next/image';
import SettingsIcon from '@mui/icons-material/Settings';
import WebLink from '@/components/base/WebLink';
import { useState } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';

const Header = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <Toolbar
        sx={{
          width: 1,
          border: '0,0,1',
          boxShadow: 1,
        }}
      >
        <Container
          maxWidth="xl"
          style={{ alignItems: 'center', verticalAlign: 'bottom' }}
        >
          <Box component={'span'}>
            <Image
              src={logo}
              alt={''}
              width={24}
              height={24}
              style={{ verticalAlign: 'middle', cursor: 'pointer' }}
            />
          </Box>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={() => {
              setOpen(true);
            }}
            // sx={{ display: 'none' }}
          >
            <AppsIcon />
          </IconButton>
          <Box component={'span'} sx={{ pl: 2 }}>
            <WebLink pathname="/" link={{ underline: 'none' }}>
              <Button size="medium">首页</Button>
            </WebLink>
            <WebLink pathname="/" link={{ underline: 'none' }}>
              <Button size="large">关于</Button>
            </WebLink>
          </Box>
          <Box component={'span'} sx={{ float: 'right' }}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
          <>
            <Drawer
              open={open}
              anchor={isSmallScreen ? 'top' : 'left'}
              onClick={() => {
                setOpen(false);
              }}
              onKeyDown={() => {
                setOpen(false);
              }}
              sx={{ minWidth: 250 }}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <WebLink
                        pathname="/admin/post/categories"
                        link={{ underline: 'none' }}
                      >
                        类别
                      </WebLink>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <WebLink
                        pathname="/admin/post/list"
                        link={{ underline: 'none' }}
                      >
                        文章
                      </WebLink>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>
          </>
        </Container>
      </Toolbar>
      <br style={{ clear: 'both' }} />
    </div>
  );
};
export default Header;
